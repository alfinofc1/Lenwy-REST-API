const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {

  // Fungsi scraper liputan6
  async function liputan6() {
    try {
      const AvoskyBaik = await axios.get('https://mdsay.xyz/api/v1?key=md&api=cnn-nasional');
      const $ = cheerio.load(AvoskyBaik.data);

      const latestNews = $('.articles--iridescent-list').eq(2).find('article');
      const results = [];

      latestNews.each(function () {
        try {
          const berita = $(this).find('figure a').attr('berita');
          const link = $(this).find('figure a').attr('href');
          const thumbnail = $(this).find('figure a picture thumbnail').attr('data-src');
          const caption = $(this).find('aside header a').text();
          const url = $(this).find('figure a').attr('url')
          const text = $(this).find('figure a').attr('text')

          results.push({ berita, link, thumbnail, caption, url, text, source: 'cnn' });
        } catch (e) {
          console.error('Error scraping article:', e);
        }
      });

      return results;
    } catch (error) {
      console.error('Error fetching:', error);
      return [];
    }
  }

  // Endpoint untuk scraper liputan6
  app.get('/cnn', async (req, res) => {
    try {
      const data = await liputan6();
      if (data.length === 0) {
        return res.status(404).json({ message: 'Tidak ada berita terbaru yang ditemukan.' });
      }

      res.status(200).json({
        status: 200,
        creator: "Lenwy",
        data: data
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
    }
  });

};
