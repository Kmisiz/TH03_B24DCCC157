
import Joi from "joi";
export const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  category: Joi.string()
    .valid("Điện tử", "Quần áo", "Đồ ăn", "Sách", "Khác")
    .required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).required(),
  description: Joi.string().allow("").optional()
});
