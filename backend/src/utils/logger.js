// Simple logging utility for the Discord clone API

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const getCurrentLevel = () => {
  const level = process.env.LOG_LEVEL || 'INFO';
  return LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  if (process.env.NODE_ENV === 'development') {
    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  }

  return JSON.stringify(logEntry);
};

const log = (level, message, meta = {}) => {
  const currentLevel = getCurrentLevel();
  const messageLevel = LOG_LEVELS[level];

  if (messageLevel <= currentLevel) {
    const formattedMessage = formatMessage(level, message, meta);
    
    if (level === 'ERROR') {
      console.error(formattedMessage);
    } else if (level === 'WARN') {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
};

const logger = {
  error: (message, meta = {}) => log('ERROR', message, meta),
  warn: (message, meta = {}) => log('WARN', message, meta),
  info: (message, meta = {}) => log('INFO', message, meta),
  debug: (message, meta = {}) => log('DEBUG', message, meta),
  
  // Request logging middleware
  requestLogger: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
      };

      if (res.statusCode >= 400) {
        logger.warn('HTTP Request', logData);
      } else {
        logger.info('HTTP Request', logData);
      }
    });

    next();
  }
};

module.exports = logger;
