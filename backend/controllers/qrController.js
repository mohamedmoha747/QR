const asyncHandler = require('express-async-handler');
const QRCode = require('qrcode');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const QrCodeModel = require('../models/QrCode');
const ScanEvent = require('../models/ScanEvent');

const parseUserAgentData = (userAgentString = '') => {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();
  const rawDevice = (result.device && result.device.type) || '';
  const deviceType = rawDevice.toLowerCase() === 'mobile'
    ? 'Mobile'
    : rawDevice.toLowerCase() === 'tablet'
    ? 'Tablet'
    : rawDevice.toLowerCase() === 'smarttv'
    ? 'TV'
    : rawDevice
    ? `${rawDevice.charAt(0).toUpperCase()}${rawDevice.slice(1)}`
    : 'Desktop';

  const browserName = result.browser.name || 'Unknown Browser';
  const browserVersion = result.browser.version || '';
  const browser = browserVersion ? `${browserName} ${browserVersion}` : browserName;

  const osName = result.os.name || 'Unknown OS';
  const osVersion = result.os.version || '';
  const os = osVersion ? `${osName} ${osVersion}` : osName;

  return { deviceType, browser, os };
};

const generateUniqueShortCode = async () => {
  let shortCode;
  let exists;
  do {
    shortCode = uuidv4().slice(0, 8);
    exists = await QrCodeModel.exists({ shortCode });
  } while (exists);
  return shortCode;
};

const createQr = asyncHandler(async (req, res) => {
  const { name, type, payload, dynamic, destinationUrl, logoUrl, foregroundColor, backgroundColor, frame, privacy, password, expiresAt, oneTime, categories, tags } = req.body;

  const qrData = buildPayload(type, payload, destinationUrl);
  const clientUrl = (process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
  const shortCode = dynamic ? await generateUniqueShortCode() : undefined;
  const qrText = dynamic ? `${clientUrl}/qr/${shortCode}` : qrData;

  const svgData = await QRCode.toString(qrText, { type: 'svg', color: { dark: foregroundColor || '#000000', light: backgroundColor || '#ffffff' } });

  const qrCode = await QrCodeModel.create({
    owner: req.user?._id,
    name,
    type,
    payload,
    dynamic,
    destinationUrl,
    shortCode,
    qrData: qrText,
    svgData,
    logoUrl,
    foregroundColor,
    backgroundColor,
    frame,
    privacy,
    password,
    expiresAt,
    oneTime,
    categories,
    tags,
  });

  res.status(201).json(qrCode);
});

const buildPayload = (type, payload, destinationUrl) => {
  switch (type) {
    case 'url':
      return payload.url;
    case 'text':
      return payload.text;
    case 'contact':
      return buildVCard(payload);
    case 'wifi':
      return `WIFI:T:${payload.security};S:${payload.ssid};P:${payload.password};H:${payload.hidden ? 'true' : 'false'};;`;
    case 'payment':
      return `PAYTO:${payload.account};AMOUNT:${payload.amount};MSG:${payload.message || ''}`;
    case 'email':
      return `MATMSG:TO:${payload.to};SUB:${payload.subject || ''};BODY:${payload.body || ''};;`;
    case 'phone':
      return `TEL:${payload.phone}`;
    case 'sms':
      return `SMSTO:${payload.phone}:${payload.message || ''}`;
    case 'location':
      return `geo:${payload.lat},${payload.lng}`;
    case 'event':
      return `BEGIN:VEVENT\nSUMMARY:${payload.title}\nDTSTART:${payload.start}\nDTEND:${payload.end}\nLOCATION:${payload.location || ''}\nDESCRIPTION:${payload.description || ''}\nEND:VEVENT`;
    default:
      return payload?.text || destinationUrl || '';
  }
};

const buildVCard = (contact) => {
  return `BEGIN:VCARD\nVERSION:3.0\nN:${contact.lastName};${contact.firstName}\nFN:${contact.firstName} ${contact.lastName}\nORG:${contact.organization || ''}\nTITLE:${contact.title || ''}\nTEL;TYPE=WORK,VOICE:${contact.phone || ''}\nEMAIL:${contact.email || ''}\nADR;TYPE=WORK:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.postalCode || ''};${contact.country || ''}\nEND:VCARD`;
};

const getMyQrs = asyncHandler(async (req, res) => {
  const query = { status: { $ne: 'deleted' } };

  if (req.user) {
    query.owner = req.user._id;
  }
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.category) {
    query.categories = req.query.category;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }

  const qrs = await QrCodeModel.find(query).sort({ updatedAt: -1 });
  res.json(qrs);
});

const getQrById = asyncHandler(async (req, res) => {
  const qr = await QrCodeModel.findById(req.params.id);
  if (!qr) {
    res.status(404);
    throw new Error('QR code not found');
  }
  res.json(qr);
});

const updateQr = asyncHandler(async (req, res) => {
  const qr = await QrCodeModel.findById(req.params.id);
  if (!qr) {
    res.status(404);
    throw new Error('QR code not found');
  }

  const { name, payload, destinationUrl, logoUrl, foregroundColor, backgroundColor, frame, privacy, password, expiresAt, oneTime, categories, tags, status } = req.body;

  const oldDestinationUrl = qr.destinationUrl;
  const oldForegroundColor = qr.foregroundColor;
  const oldBackgroundColor = qr.backgroundColor;
  const oldFrame = qr.frame;
  const oldPayload = JSON.stringify(qr.payload);
  const oldLogoUrl = qr.logoUrl;

  if (name !== undefined) qr.name = name;
  if (payload !== undefined) qr.payload = payload;
  if (destinationUrl !== undefined) qr.destinationUrl = destinationUrl;
  if (logoUrl !== undefined) qr.logoUrl = logoUrl;
  if (foregroundColor !== undefined) qr.foregroundColor = foregroundColor;
  if (backgroundColor !== undefined) qr.backgroundColor = backgroundColor;
  if (frame !== undefined) qr.frame = frame;
  if (privacy !== undefined) qr.privacy = privacy;
  if (password !== undefined) qr.password = password;
  if (expiresAt !== undefined) qr.expiresAt = expiresAt;
  if (oneTime !== undefined) qr.oneTime = oneTime;
  if (categories !== undefined) qr.categories = categories;
  if (tags !== undefined) qr.tags = tags;
  if (status !== undefined) qr.status = status;

  const clientUrl = (process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
  const styleChanged = qr.dynamic && (
    (foregroundColor !== undefined && foregroundColor !== oldForegroundColor) ||
    (backgroundColor !== undefined && backgroundColor !== oldBackgroundColor) ||
    (frame !== undefined && frame !== oldFrame) ||
    (logoUrl !== undefined && logoUrl !== oldLogoUrl)
  );

  if (!qr.dynamic || styleChanged || (payload !== undefined && JSON.stringify(payload) !== oldPayload)) {
    const qrData = buildPayload(qr.type, qr.payload, qr.destinationUrl);
    qr.qrData = qr.dynamic ? `${clientUrl}/qr/${qr.shortCode}` : qrData;
    qr.svgData = await QRCode.toString(qr.qrData, { type: 'svg', color: { dark: qr.foregroundColor, light: qr.backgroundColor } });
  } else if (qr.dynamic) {
    qr.qrData = `${clientUrl}/qr/${qr.shortCode}`;
  }

  const updatedQr = await qr.save();
  res.json(updatedQr);
});

const deleteQr = asyncHandler(async (req, res) => {
  const qr = await QrCodeModel.findById(req.params.id);
  if (!qr) {
    res.status(404);
    throw new Error('QR code not found');
  }

  qr.status = 'deleted';
  await qr.save();
  res.json({ message: 'QR code deleted' });
});

const archiveQr = asyncHandler(async (req, res) => {
  const qr = await QrCodeModel.findById(req.params.id);
  if (!qr) {
    res.status(404);
    throw new Error('QR code not found');
  }

  qr.status = 'archived';
  await qr.save();
  res.json({ message: 'QR code archived' });
});

const redirectDynamicQr = asyncHandler(async (req, res) => {
  const qr = await QrCodeModel.findOne({ shortCode: req.params.shortCode, dynamic: true, status: 'active' });
  if (!qr) {
    res.status(404);
    throw new Error('Dynamic QR not found');
  }

  if (qr.expiresAt && qr.expiresAt < Date.now()) {
    res.status(410);
    throw new Error('QR code expired');
  }

  if (qr.oneTime && qr.scanCount > 0) {
    res.status(410);
    throw new Error('QR code already used');
  }

  qr.scanCount += 1;
  qr.lastScannedAt = Date.now();
  await qr.save();

  const userAgent = req.headers['user-agent'] || '';
  const { deviceType, browser, os } = parseUserAgentData(userAgent);

  // normalize IP (handle IPv4-mapped IPv6)
  let ip = req.ip || req.connection?.remoteAddress || '';
  if (ip && ip.startsWith('::ffff:')) ip = ip.split('::ffff:')[1];
  const geo = geoip.lookup(ip) || {};
  const country = geo.country || '';
  const city = geo.city || '';

  await ScanEvent.create({
    qrCode: qr._id,
    ipAddress: ip,
    userAgent,
    device: deviceType,
    browser,
    os,
    country,
    city,
    referrer: req.headers.referer || '',
  });

  res.json({ destinationUrl: qr.destinationUrl });
});

const getQrAnalytics = asyncHandler(async (req, res) => {
  const qrId = req.params.id;
  const qr = await QrCodeModel.findById(qrId);
  if (!qr) {
    res.status(404);
    throw new Error('QR code not found');
  }

  const events = await ScanEvent.find({ qrCode: qrId }).sort({ createdAt: -1 });
  const totalScans = events.length;
  const uniqueScans = new Set(events.map((event) => event.ipAddress)).size;

  const normalizedEvents = events.map((e) => {
    const { deviceType, browser, os } = parseUserAgentData(e.userAgent || '');
    return {
      ...e.toObject(),
      device: e.device || deviceType,
      browser: e.browser || browser,
      os: e.os || os,
    };
  });

  const deviceBreakdown = normalizedEvents.reduce((acc, e) => {
    acc[e.device || 'Desktop'] = (acc[e.device || 'Desktop'] || 0) + 1;
    return acc;
  }, {});

  const browserBreakdown = normalizedEvents.reduce((acc, e) => {
    const b = (e.browser && e.browser.split(' ')[0]) || 'Unknown';
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const countryBreakdown = normalizedEvents.reduce((acc, e) => {
    acc[e.country || 'Unknown'] = (acc[e.country || 'Unknown'] || 0) + 1;
    return acc;
  }, {});

  const recent = normalizedEvents.slice(0, 50).map((e) => ({
    timestamp: e.createdAt,
    ipAddress: e.ipAddress,
    device: e.device,
    browser: e.browser,
    os: e.os,
    country: e.country,
    city: e.city,
    userAgent: e.userAgent,
    referrer: e.referrer,
  }));

  res.json({ totalScans, uniqueScans, deviceBreakdown, browserBreakdown, countryBreakdown, recent });
});

module.exports = { createQr, getMyQrs, getQrById, updateQr, deleteQr, archiveQr, redirectDynamicQr, getQrAnalytics };
