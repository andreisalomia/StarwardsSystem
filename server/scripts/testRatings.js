const m = require('../dist/models');
const svc = require('../dist/services/ratingService');

(async () => {
  try {
    const sequelize = m.sequelize;
    await sequelize.authenticate();

    const rows = await sequelize.query(
      'SELECT "HotelID", COUNT("ReviewID") as cnt FROM "Reviews" GROUP BY "HotelID" HAVING COUNT("ReviewID") >= 3 ORDER BY cnt DESC LIMIT 5',
      { type: sequelize.QueryTypes.SELECT },
    );

    console.log('Hotels to test:', rows);

    for (const r of rows) {
      const id = r.HotelID;
      try {
        const res = await svc.getOrComputeRating(id);
        console.log('--- Hotel', id, '---');
        console.log(JSON.stringify(res.get ? res.get() : res, null, 2));
      } catch (e) {
        console.error('error for', id, e);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})();
