module.exports = {
  async up(db, client) {
    // Add the `status` field to all events
    await db.collection('events').updateMany({}, {$unset: {location: ""}});
  },

  async down(db, client) {
    // Remove the `status` field from all events
    await db.collection('events').updateMany({}, {$set: {location: ""}});
  }
};
