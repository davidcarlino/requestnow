const Song = require("../models/SongRequest");
const Event = require("../models/Event");

const addSong = async (req, res) => {
  try {
    const event = await Event.findOne({ eventCode: req.body.eventCode });
    const song = new Song({...req.body, event: event._id});
    event.songRequest.push(song);
    await event.save();
    await song.save();
    res.status(200).send({
      message: "Song Added Successfully!",
      songs: song
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSpotifyToken = async () => {
  const CLIENT_ID = 'b72ad25967b148f6849d6c48be955495';
  const CLIENT_SECRET = 'f42ec53cb9054527830b6d5d28547f89';
  const tokenURL = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  try {
    const response = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`, // btoa() encodes to base64
      },
      body: body.toString(), // body needs to be a string
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Spotify token');
    }

    const data = await response.json();
    // console.log(data); // Process the token data

    return data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
  }

};

const searchSong = async (req, res) => {
  const {q } = req.query;
  try {
    const token = await getSpotifyToken();
    const params = new URLSearchParams({
      q: q,
      type: 'track',
      limit: 10,
    });
  
    const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data from Spotify');
    }
  
    const data = await response.json();
    const tracks = data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumImage: track.album.images[0]?.url,
      year: track.album.release_date ? track.album.release_date.split('-')[0] : 'Unknown', // Extract year or 'Unknown' if not available
    }));
  
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch data from Spotify' });
  }
};

module.exports = {
  addSong,
  searchSong,
};