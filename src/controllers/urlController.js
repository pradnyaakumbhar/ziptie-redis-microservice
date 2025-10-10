const errorMessages = require('../enums/errorMessages');
const httpStatus = require('../enums/httpStatus');
const urlService = require('../services/urlService');

const validateRequestBody = (body) => {
  const { ttl, longUrl, userId } = body || {};

  if (!longUrl || typeof longUrl !== 'string') {
    return errorMessages.LONG_URL_REQUIRED;
  }

  if (!userId || typeof userId !== 'string') {
    return errorMessages.USER_ID_REQUIRED;
  }

  const ttlNumber = Number(ttl);
  if (!Number.isInteger(ttlNumber) || ttlNumber <= 0) {
    return errorMessages.TTL_INVALID;
  }

  return null;
};

const createShortUrl = async (req, res) => {
  const validationError = validateRequestBody(req.body);

  if (validationError) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: validationError });
  }

  const ttlNumber = Number(req.body.ttl);

  try {
    const result = await urlService.createShortUrl({
      ttl: ttlNumber,
      longUrl: req.body.longUrl,
      userId: req.body.userId
    });

    return res.status(httpStatus.CREATED).json(result);
  } catch (error) {
    console.error('[urlController:createShortUrl]', error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: errorMessages.GENERIC_FAILURE });
  }
};

module.exports = {
  createShortUrl
};
