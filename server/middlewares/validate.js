// File: server/middlewares/validate.js
// Xác thực dữ liệu đầu vào sử dụng Joi

const Joi = require("joi");

/**
 * Schema: Tạo/Upload phim mới
 */
const createMovieSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Tiêu đề phim không được để trống",
    "string.max": "Tiêu đề phim không được vượt quá 200 ký tự",
    "any.required": "Tiêu đề phim là bắt buộc",
  }),
  description: Joi.string().trim().max(2000).allow("", null).messages({
    "string.max": "Mô tả không được vượt quá 2000 ký tự",
  }),
  plot: Joi.string().trim().max(2000).allow("", null),
  videoUrl: Joi.string().uri().required().messages({
    "string.uri": "URL video không hợp lệ",
    "any.required": "URL video là bắt buộc",
  }),
  thumbnailUrl: Joi.string().uri().allow("", null).messages({
    "string.uri": "URL thumbnail không hợp lệ",
  }),
  genre: Joi.string().trim().max(100).allow("", null),
  releaseYear: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear() + 5)
    .allow(null)
    .messages({
      "number.min": "Năm phát hành không hợp lệ",
      "number.max": "Năm phát hành không hợp lệ",
    }),
});

/**
 * Schema: Cập nhật phim (tất cả field là optional)
 */
const updateMovieSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).messages({
    "string.empty": "Tiêu đề phim không được để trống",
    "string.max": "Tiêu đề phim không được vượt quá 200 ký tự",
  }),
  description: Joi.string().trim().max(2000).allow("", null),
  plot: Joi.string().trim().max(2000).allow("", null),
  videoUrl: Joi.string().uri().messages({
    "string.uri": "URL video không hợp lệ",
  }),
  thumbnailUrl: Joi.string().uri().allow("", null),
  genre: Joi.string().trim().max(100).allow("", null),
  releaseYear: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear() + 5)
    .allow(null),
}).min(1).messages({
  "object.min": "Cần ít nhất 1 trường để cập nhật",
});

/**
 * Schema: Phân trang (query params)
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(200).allow("", null),
});

/**
 * Factory: Tạo middleware validate từ schema
 * @param {Joi.ObjectSchema} schema
 * @param {"body"|"query"|"params"} source - Nguồn dữ liệu cần validate
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Trả về TẤT CẢ lỗi, không dừng ở lỗi đầu tiên
      stripUnknown: true, // Xóa các field không nằm trong schema
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: messages,
      });
    }

    // Ghi đè dữ liệu đã được validate & sanitize
    req[source] = value;
    next();
  };
};

module.exports = {
  validate,
  createMovieSchema,
  updateMovieSchema,
  paginationSchema,
};
