const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService {
    async init() {
     
        // const db = cds.connect.to({ kind: 'sqlite', credentials: { database: 'phani.db' } })
        const db = await cds.connect.to('db')
        const { Books } = cds.entities('sap.capire.bookshop');


        // Reduce stock of ordered books if available stock suffices

        this.on('submitOrder', async (req) => {
            const { book, quantity } = req.data;
            if (quantity < 1) return req.reject(400, `quantity has to be 1 or more`);
            let b = await db.read (Books , book ,c => c.stock )
           // let {stock} = await db.read (Books,book, b => b.stock)
            // let {title} = await db.read (Books,book, b => b.title)
            
            if (!b) return req.error(404, `Book #${book} doesn't exist`)

            let { stock } = b;
            if (quantity > stock) return req.reject(409, `${quantity} exceeds stock for book #${book}`)
            await UPDATE(Books, book).with({ stock: stock -= quantity })

            await this.emit('OrderedBook', { book, quantity, buyer: req.user.id })
            return { stock }

        })

        // Add some discount for overstocked books
        this.after('READ', 'ListOfBooks', each => {
            if (each.stock > 111) each.title += ` -- 11% discount!`
        })

        return super.init()


    }
}

module.exports = { CatalogService };