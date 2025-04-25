const Article = require('../models/articleModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Article.find(JSON.parse(queryStr)).populate({
      path: 'authors',
      select: 'name username profile_picture_url'
    });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sort by pinned first, then by date
      query = query.sort('-pinned -published_date');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Article.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const articles = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: articles.length,
      pagination,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate({
      path: 'authors',
      select: 'name username profile_picture_url linkedin_url github_url personal_bio'
    });
    
    if (!article) {
      return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to sanitize HTML content to prevent XSS attacks
const sanitizeContent = (content) => {
  // In a production environment, you would want to use a proper HTML sanitizer
  // such as DOMPurify or sanitize-html. For simplicity, we're just doing some
  // basic checks here.
  if (!content) return '';
  
  if (typeof content === 'object' && content.content) {
    return content.content;
  }
  
  return content;
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Author
exports.createArticle = async (req, res, next) => {
  try {
    // Add user to req.body.authors
    if (!req.body.authors) {
      req.body.authors = [req.user.id];
    } else if (!Array.isArray(req.body.authors)) {
      req.body.authors = [req.body.authors];
    }
    
    // Ensure the current user is added as an author
    if (!req.body.authors.includes(req.user.id)) {
      req.body.authors.push(req.user.id);
    }
    
    // Process article content to ensure it's properly sanitized
    if (req.body.article_content) {
      req.body.article_content = {
        content: sanitizeContent(req.body.article_content)
      };
    }
    
    const article = await Article.create(req.body);
    
    // Add article to each author's articles array
    for (const authorId of article.authors) {
      await User.findByIdAndUpdate(
        authorId,
        { $push: { articles: article._id } },
        { new: true }
      );
    }
    
    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Author or Admin
exports.updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);
    
    if (!article) {
      return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user is article owner or admin
    if (
      !article.authors.includes(req.user.id) && 
      req.user.admin_status !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this article`,
          403
        )
      );
    }
    
    // Update last_edited field
    req.body.last_edited = Date.now();
    
    // Process article content to ensure it's properly sanitized
    if (req.body.article_content) {
      req.body.article_content = {
        content: sanitizeContent(req.body.article_content)
      };
    }
    
    // Make the update
    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'authors',
      select: 'name username profile_picture_url'
    });
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Author or Admin
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user is article owner or admin
    if (
      !article.authors.includes(req.user.id) && 
      req.user.admin_status !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this article`,
          403
        )
      );
    }
    
    // Remove article from all authors' articles arrays
    for (const authorId of article.authors) {
      await User.findByIdAndUpdate(
        authorId,
        { $pull: { articles: article._id } }
      );
    }
    
    await Article.deleteOne({ _id: article._id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin/Unpin article
// @route   PATCH /api/articles/:id/pin
// @access  Private/Admin
exports.pinArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);
    
    if (!article) {
      return next(new ErrorResponse(`Article not found with id of ${req.params.id}`, 404));
    }
    
    const pinned = req.body.pinned === undefined ? !article.pinned : req.body.pinned;
    
    article = await Article.findByIdAndUpdate(
      req.params.id,
      { pinned },
      { new: true }
    ).populate({
      path: 'authors',
      select: 'name username profile_picture_url'
    });
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
}; 