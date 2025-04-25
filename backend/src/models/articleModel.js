const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  published_date: {
    type: Date,
    default: Date.now
  },
  last_edited: {
    type: Date,
    default: Date.now
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  cover_picture_url: {
    type: String,
    default: 'default-cover.jpg'
  },
  article_content: {
    type: Object,
    required: [true, 'Please add content to the article'],
    // Can store both object format (with content field) or direct HTML string
    // This allows flexibility in storing formatted text, images, etc.
    validate: {
      validator: function(value) {
        // Check if it's an object with content property or a plain HTML string
        return (
          (typeof value === 'object' && value !== null && value.content) || 
          (typeof value === 'string' && value.length > 0)
        );
      },
      message: 'Article content must be provided either as HTML string or an object with content property'
    }
  },
  pinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    enum: ['engineering', 'products', 'impact', 'nonprofits'],
    default: 'engineering'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware for cleanup when article is deleted
ArticleSchema.pre('findOneAndDelete', async function(next) {
  // This would be a good place to handle any cleanup
  // e.g., remove article references from users
  next();
});

module.exports = mongoose.model('Article', ArticleSchema); 