import Category from '../models/Category.js';
import ProductModal from '../models/Product.js';

const addCategory = async (req, res) =>{
    try {
        const {categoryName , categoryDescription } = req.body;

        const existingCategory = await Category.findOne({categoryName});
        if(existingCategory) {
            return res.status(400).json({success: false, message: 'Category already exists'});
        }

        const newCategory = new Category({
        categoryName,categoryDescription
        });

        await newCategory.save();
        return res.status(201).json({success: true, message: 'Category added sucessfully'});
    }catch (error) {
        console.error('Error adding category :',error);
        return res.status(500).json({success: false , message: 'Server error'});
    }
}

const getCategories = async (req , res) => {
    try{
        const categories = await Category.find();
        return res.status(200).json({success: true , categories});
    }catch (error) {
        console.error("Error feteching categories:",error);
        return res.status(500).json({success:false , message: 'Server error in getting cateogires'});
    }
}

const updateCategory = async (req,res) => {
    try{
        const { id } = req.params;
        const {categoryName , categoryDescription} = req.body;

        const existingCategory = await Category.findById(id);
        if(!existingCategory){
            return res.status(404).json({success : false , message : 'Category not found'});
        }

        const updateCategory = await Category.findByIdAndUpdate(
            id,
            {categoryName,categoryDescription},
            {new : true}
        );
        return res.status(200).json({success:true , message : "Category Updated Sucessfully"});
    } catch (error) {
        console.error('Errror Updating category :',error);
        return res.status(500).json({success : false , message : 'Server error'});
    }
}

const deleteCategory = async (req,res) => {
    try {
        const { id } = req.params;

        const productCount = await ProductModal.countDocuments({categoryId: id});

        if(productCount > 0){
            return res.status(400).json({success:false , message:"cannot delete category associated with products"})
        }


        const existingCategory = await Category.findById(id);
        if(!existingCategory) {
            return res.status(404).json({success :false ,message : 'Category not found'});
        }
        await Category.findByIdAndDelete(id);
        return res.status(200).json({success : true , message : 'Category delted sucessfully'});
    } catch (error) {
        console.error('Error delteing category' , error);
        return res.status(500).json({success : false , message: 'Server error'});
    }
}

export {addCategory , getCategories , updateCategory , deleteCategory};