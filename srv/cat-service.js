const cds = require('@sap/cds')

class CatalogService  extends cds.ApplicationService{init(){

const { Books } = cds.entities('sap.capire.bookshop') ;

// Reduce stock of ordered books if available stock suffices

this.on('submitOrder', async (req) =>{
    const { book,  quantity } = req.data;
    if (quantity < 1) return req.reject (400,`quantity has to be 1 or more`);

})



}} 

module.exports = { CatalogService };