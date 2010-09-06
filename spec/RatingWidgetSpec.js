describe("RatingWidget", function() {
  var height = 40;
  
  it("should generate a rating star string of 2 red stars, 1 grey with height 40", function() {
    var rating = 2;
    var ratingStarString = buildRatingStarString(rating, height);
    expect(ratingStarString).toEqual('<div style="text-align: center; display: block"><img src="themes/agile2010/img/on_star.png" height="40" alt="2 stars" class="ratingStar star_0"/><img src="themes/agile2010/img/on_star.png" height="40" alt="2 stars" class="ratingStar star_1"/><img src="themes/agile2010/img/off_star.png" height="40" alt="2 stars" class="ratingStar star_2"/></div>');
  });
  
  it("should generate a rating star string of 3 grey stars with height 40", function() {
    var rating = 0;
    var ratingStarString = buildRatingStarString(rating, height);
    expect(ratingStarString).toEqual('<div style="text-align: center; display: block"><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_0"/><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_1"/><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_2"/></div>');
  });
});
