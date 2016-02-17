var chai = require('chai'),
    assert = chai.assert,
    Prismic = require('express-prismic').Prismic,
    Configuration = require('configuration').Configuration,
    repository = Configuration.apiEndpoint;
    cacheTTL = 50;
    
exports.getApiHome = function(accessToken, callback) {
  Prismic.Api(Configuration.apiEndpoint, callback, accessToken || Configuration.accessToken || undefined);
}; 

exports.getDocuments = function(query) {
  return new Promise(function (resolve) {
    exports.getApiHome(Configuration.accessToken, function(err, Api) {
      Api.form('everything')
      .ref(Api.master())
      .fetchLinks()
      .query( query )
      .submit(function(err, documents) {
        resolve(documents);
        // done();
      });
    }, null, null, null, cacheTTL);
  });
};


describe('prismic.io - Helpers', function(){
  it('should connect to retrieve a document', function(done) {
    exports.getDocuments( Prismic.Predicates.any('my.product-categories.uid', ['product']) )
    .then(function(documents){
      assert.equal(documents.results_size, 1);
      done();
    });
  });
});
    
