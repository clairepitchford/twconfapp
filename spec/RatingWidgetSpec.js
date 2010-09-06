describe("Rating widget", function () {
  var starImageHeight = 40;
  
  describe("Rating star string creator", function () {
    it("should generate a rating star string of 2 red stars, 1 grey with height 40", function () {
      var rating = 2;
      var ratingStarString = buildRatingStarString(rating, starImageHeight);
      expect(ratingStarString).toEqual('<div style="text-align: center; display: block"><img src="themes/agile2010/img/on_star.png" height="40" alt="2 stars" class="ratingStar star_0"/><img src="themes/agile2010/img/on_star.png" height="40" alt="2 stars" class="ratingStar star_1"/><img src="themes/agile2010/img/off_star.png" height="40" alt="2 stars" class="ratingStar star_2"/></div>');
    });
  
    it("should generate a rating star string of 3 grey stars with height 40", function () {
      var rating = 0;
      var ratingStarString = buildRatingStarString(rating, starImageHeight);
      expect(ratingStarString).toEqual('<div style="text-align: center; display: block"><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_0"/><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_1"/><img src="themes/agile2010/img/off_star.png" height="40" alt="0 stars" class="ratingStar star_2"/></div>');
    });
  });
  
  describe("Rating widget creator", function () {
    var breakfastSessionID = "breakfast";
    var savedRating;
    
    beforeEach(function () {
      savedRating = localStorage.getItem(breakfastSessionID + "-rating");
    });
    
    afterEach(function () {
      if (savedRating) {
        localStorage.setItem(breakfastSessionID + "-rating", savedRating);
      }
    });
    
    it("should create a go-skip slider widget when the session date is in the future", function () {
      var isInFuture = true;
      var widgetString = buildRatingWidget(breakfastSessionID, isInFuture, 40);
      expect(widgetString).toContain('class="attend-slider touch"');
    });
    
    it("should create a rate-this-session widget when the session date is in the past and no rating has been given", function () {
      localStorage.removeItem(breakfastSessionID + "-rating");
      var isInFuture = false;
      var widgetString = buildRatingWidget(breakfastSessionID, isInFuture, 40);
      expect(widgetString).toContain('class="feedbackLink"');
    });
    
    it("should create a rating-star widget when the session date is in the past and a previous rating exists", function () {
      localStorage.setItem(breakfastSessionID + "-rating", 2);
      var isInFuture = false;
      var widgetString = buildRatingWidget(breakfastSessionID, isInFuture, 40);
      expect(widgetString).toContain('class="ratingStar star_0"');
    });
  });
});
