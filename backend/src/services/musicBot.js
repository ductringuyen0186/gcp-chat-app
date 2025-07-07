// Simple in-memory music queue per channel
// In production, use Redis or a database for persistence
const ytdl = require('ytdl-core');

const queues = {};

function getQueue(channelId) {
  if (!queues[channelId]) queues[channelId] = [];
  return queues[channelId];
}

async function addToQueue(channelId, youtubeUrl, requestedBy) {
  let info;
  try {
    info = await ytdl.getInfo(youtubeUrl);
  } catch (e) {
    throw new Error('Invalid YouTube URL or unable to fetch info');
  }
  const track = {
    url: youtubeUrl,
    title: info.videoDetails.title,
    thumbnail: info.videoDetails.thumbnails[0]?.url,
    duration: info.videoDetails.lengthSeconds,
    requestedBy,
    id: info.videoDetails.videoId
  };
  getQueue(channelId).push(track);
  return track;
}

function getCurrentTrack(channelId) {
  return getQueue(channelId)[0] || null;
}

function skipTrack(channelId) {
  getQueue(channelId).shift();
  return getCurrentTrack(channelId);
}

function clearQueue(channelId) {
  queues[channelId] = [];
}

module.exports = {
  getQueue,
  addToQueue,
  getCurrentTrack,
  skipTrack,
  clearQueue
};
