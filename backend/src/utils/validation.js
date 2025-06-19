// Validation utilities for the Discord clone API

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateChannelName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
};

const validateMessageContent = (content) => {
  if (!content || typeof content !== 'string') return false;
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= 2000;
};

const validateDisplayName = (displayName) => {
  if (!displayName || typeof displayName !== 'string') return false;
  const trimmed = displayName.trim();
  return trimmed.length > 0 && trimmed.length <= 32;
};

const validateUserStatus = (status) => {
  return ['online', 'away', 'offline'].includes(status);
};

const validateChannelType = (type) => {
  return ['text', 'voice'].includes(type);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const validatePagination = (limit, offset) => {
  const parsedLimit = parseInt(limit) || 50;
  const parsedOffset = parseInt(offset) || 0;
  
  return {
    limit: Math.min(Math.max(parsedLimit, 1), 100), // Between 1 and 100
    offset: Math.max(parsedOffset, 0) // Non-negative
  };
};

module.exports = {
  validateEmail,
  validateChannelName,
  validateMessageContent,
  validateDisplayName,
  validateUserStatus,
  validateChannelType,
  sanitizeInput,
  validatePagination
};
