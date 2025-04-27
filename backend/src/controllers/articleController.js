const Article = require('../models/articleModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorHandler');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

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

// Function to sanitize content for XSS prevention
function sanitizeContent(content) {
  // Check if content is already a string
  if (typeof content === 'string') {
    return content;
  }

  // If it's an object with a content property
  if (typeof content === 'object' && content !== null && content.content) {
    return content.content;
  }

  // Otherwise, try to stringify it
  return JSON.stringify(content);
}

// Function to handle file upload
const handleFileUpload = async (file, folderName) => {
  // Create directory path for uploads
  const uploadDir = path.join(__dirname, '../../public/uploads/', folderName);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Generate a unique filename
  const timestamp = Date.now();
  const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`.toLowerCase();
  
  // Define the file path
  const uploadPath = path.join(uploadDir, uniqueFilename);
  
  // Move the file to the upload directory
  return new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Return the relative URL path for the file
      const fileUrl = `/uploads/${folderName}/${uniqueFilename}`;
      resolve(fileUrl);
    });
  });
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Author
exports.createArticle = async (req, res, next) => {
  try {
    // Handle cover image upload if present
    if (req.files && req.files.coverImage) {
      try {
        const fileUrl = await handleFileUpload(req.files.coverImage, 'covers');
        req.body.cover_picture_url = fileUrl;
      } catch (err) {
        return next(new ErrorResponse('Error uploading cover image', 500));
      }
    } else {
      // Set default cover image
      req.body.cover_picture_url = 'default-cover.jpg';
    }
    
    // Parse JSON strings from FormData if needed
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (err) {
        console.error('Error parsing tags:', err);
      }
    }
    
    if (req.body.article_content && typeof req.body.article_content === 'string') {
      try {
        req.body.article_content = JSON.parse(req.body.article_content);
      } catch (err) {
        console.error('Error parsing article content:', err);
      }
    }
    
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
    
    // Handle cover image upload if present
    if (req.files && req.files.coverImage) {
      try {
        // Always delete old cover image if it exists and is not a default image
        if (article.cover_picture_url && 
            !article.cover_picture_url.includes('default-cover') && 
            fs.existsSync(path.join(__dirname, '../../public', article.cover_picture_url))) {
          fs.unlinkSync(path.join(__dirname, '../../public', article.cover_picture_url));
        }
        
        const fileUrl = await handleFileUpload(req.files.coverImage, 'covers');
        req.body.cover_picture_url = fileUrl;
      } catch (err) {
        return next(new ErrorResponse('Error uploading cover image', 500));
      }
    } else if (req.body.remove_cover === 'true') {
      // Handle removal of cover image
      if (article.cover_picture_url && 
          !article.cover_picture_url.includes('default-cover') &&
          fs.existsSync(path.join(__dirname, '../../public', article.cover_picture_url))) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../public', article.cover_picture_url));
        } catch (err) {
          console.error('Error deleting cover image:', err);
        }
      }
      // Set cover_picture_url to default or null
      req.body.cover_picture_url = 'default-cover.jpg';
    }
    
    // Parse JSON strings from FormData if needed
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (err) {
        console.error('Error parsing tags:', err);
      }
    }
    
    if (req.body.article_content && typeof req.body.article_content === 'string') {
      try {
        req.body.article_content = JSON.parse(req.body.article_content);
      } catch (err) {
        console.error('Error parsing article content:', err);
      }
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

// @desc    Get current user's articles
// @route   GET /api/articles/mine
// @access  Private
exports.getMyArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ authors: req.user.id })
      .populate({
        path: 'authors',
        select: 'name username profile_picture_url'
      })
      .sort('-pinned -published_date');
    
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
}; 