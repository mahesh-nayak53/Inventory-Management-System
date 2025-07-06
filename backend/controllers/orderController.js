import ProductModal from '../models/Product.js';
import OrderModel from '../models/Order.js';

const addOrder = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const userId = req.user._id;

    const product = await ProductModal.findById(productId);
    if (!product) {

      return res.status(404).json({ message: "Product not found in order" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock for this product" });
    } else {
      product.stock -= parseInt(quantity);
      await product.save();
    }

    const orderObj = new OrderModel({
      customer: userId,
      product: productId,
      quantity,
      totalPrice: total
    });

    await orderObj.save();
    return res.status(200).json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("Order placement failed:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = {};
    if(req.user.role === "customer"){
      query = {customer : userId};
    }
    const orders = await OrderModel.find(query).populate({path: 'product', populate:{
        path: 'categoryId',
        select:'categoryName'
    },select : 'name price'}).populate('customer', 'name email');
    return res.status(200).json({success: true, orders});
}catch (error){
    console.log(error);
    return res.status(500).json({sucess: false, error: "server error in fetching orders"});
}
};

export { addOrder , getOrders };
