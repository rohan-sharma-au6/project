const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const auth={}


test("Gets the test endpoint", async (done) => {
    const response = await request.get("/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("pass!");
    done();
});

test("login user and get token",function(done){
    jest.setTimeout(5000);
    request.post("/login").send({
        phoneNumber:"7014537710",
        password:"1234"
    }).expect(200).end(function(err,res){
        auth.accessToken= res.body.accessToken;
        if(err) return done(err);
        done()
    })
})

//Get all product 
test('get status code 200 /products', function (done) {
    request.get('/products')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
});

// deatils of product 
test('get status code 200 /detail/:_id', function (done) {
    request.get('/detail/5e798e7dd74e6443846d0ad8')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
});

//product category 
test('get status code 200 /category/:category', function (done) {
    request.get('/category/oil')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
});

// review of product
test('get status code 200 /reviews/:id', function (done) {
    request.get('/reviews/5e798e7dd74e6443846d0ad8')
      .expect(200)
      .set({
        Authorization: `jwt ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
});

// cart  
test('get status code 200 /carts', function (done) {
    request.get('/carts')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
 })

//ADD to cart
test('get status code 200 /addtocart/:_id', function (done) {
    request.post('/addtocart/5e798e7dd74e6443846d0ad8')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
})

// Remove products from cart
test('get status code 200 /removeFromCart/:_id', function (done) {
    request.post('/removeFromCart/5e798e7dd74e6443846d0ad8')
      .expect(200)
      .set({
        Authorization:`JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
})

//address
test('get status code 200 /address', function (done) {
    request.get('/address')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
    });
})

//get wishlist
test('get status code 200 /wishlists', function (done) {
    request.get('/wishlists')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  //post item in wishlist
test('get status code 200 /wishlists/:id', function (done) {
    request.post('/addToWishlist/50')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
})
  // Removing item from Wishlist
test('get status code 200 /removeFromWishlist/:id', function (done) {
    request.post('/removeFromWishlist/1')
      .expect(200)
      .set({
        Authorization: `JWT ${auth.accessToken}`
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
})
