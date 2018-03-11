import Cart from '../models/cart'     

export default (req,res,next) => {
    if (req.user){
        let total = 0;
        Cart.findOne({owner: req.user._id}, (err,cart) =>{
            if (cart) {
                for(let i=0; i< cart.items.length; i++) {
                    total += cart.items[i].quantity
                }
                res.locals.cartLength = total
            } else {
                res.locals.cartLength = 0
            }
            next()
        })
    } else {
        next()
    }
}