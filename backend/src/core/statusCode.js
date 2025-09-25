export const statusCode = {
  GRAPHQL_PARSE_FAILED: "GRAPHQL_PARSE_FAILED", //Không parse được query
  GRAPHQL_VALIDATION_FAILED: "GRAPHQL_VALIDATION_FAILED", //Query không hợp lệ
  BAD_USER_INPUT: "BAD_USER_INPUT", //Input user sai
  UNAUTHENTICATED: "UNAUTHENTICATED", //Chưa đăng nhập / token sai
  FORBIDDEN: "FORBIDDEN", //Không có quyền
  PERSISTED_QUERY_NOT_FOUND: "PERSISTED_QUERY_NOT_FOUND", //Persisted query không tìm thấy
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR", //Lỗi server
};
