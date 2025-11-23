/**
 * Vietnamese translations
 */

export default {
  common: {
    buttons: {
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      submit: 'Gửi',
      search: 'Tìm kiếm',
      export: 'Xuất dữ liệu',
      import: 'Nhập dữ liệu',
      close: 'Đóng',
      back: 'Quay lại',
      next: 'Tiếp theo',
      previous: 'Trước',
      confirm: 'Xác nhận',
      logout: 'Đăng xuất',
    },
    messages: {
      loading: 'Đang tải...',
      success: 'Thành công!',
      error: 'Có lỗi xảy ra',
      noData: 'Không có dữ liệu',
      confirmDelete: 'Bạn có chắc muốn xóa?',
    },
    labels: {
      email: 'Email',
      password: 'Mật khẩu',
      search: 'Tìm kiếm',
      language: 'Ngôn ngữ',
    },
  },
  
  auth: {
    login: {
      title: 'Đăng nhập',
      subtitle: 'Nhập email để nhận mã OTP',
      emailPlaceholder: 'your@email.com',
      requestOtp: 'Nhận mã OTP',
      verifyOtp: 'Xác thực OTP',
      otpSent: 'Mã OTP đã được gửi đến email của bạn',
      otpPlaceholder: 'Nhập 6 chữ số',
      resendOtp: 'Gửi lại mã',
    },
    errors: {
      invalidEmail: 'Email không hợp lệ',
      invalidOtp: 'Mã OTP không đúng',
      otpExpired: 'Mã OTP đã hết hạn',
      turnstileFailed: 'Xác thực bảo mật thất bại',
    },
  },
  
  dashboard: {
    title: 'Bảng điều khiển',
    greeting: 'Xin chào, {{name}}!',
    tier: {
      free: 'Gói Miễn phí',
      pro: 'Gói Pro',
      upgrade: 'Nâng cấp lên Pro',
    },
  },
  
  navigation: {
    seoTools: 'Công cụ SEO',
    contentTools: 'Công cụ Content',
    settings: 'Cài đặt',
    account: 'Tài khoản',
  },
  
  tools: {
    keywordResearch: {
      name: 'Nghiên cứu Từ khóa',
      description: 'Phân tích từ khóa, mật độ và đối thủ cạnh tranh',
      inputLabel: 'Nhập từ khóa',
      inputPlaceholder: 'vd: seo tools',
      analyze: 'Phân tích',
      results: {
        density: 'Mật độ từ khóa',
        volume: 'Lượng tìm kiếm',
        competitorScore: 'Điểm cạnh tranh',
        lsiKeywords: 'Từ khóa liên quan',
      },
    },
    
    onpageSeo: {
      name: 'Phân tích SEO On-Page',
      description: 'Kiểm tra meta tags, headers và schema markup',
      inputLabel: 'URL hoặc HTML',
      analyze: 'Phân tích SEO',
      score: 'Điểm SEO',
      issues: 'Vấn đề',
      recommendations: 'Đề xuất',
    },
    
    backlinkAnalyzer: {
      name: 'Phân tích Backlink',
      description: 'Phân tích profile backlink và phát hiện link độc hại',
      uploadCsv: 'Tải lên file CSV',
      totalBacklinks: 'Tổng backlinks',
      toxicLinks: 'Link độc hại',
      topDomains: 'Domain hàng đầu',
    },
    
    contentBrief: {
      name: 'Tạo Content Brief',
      description: 'Tạo outline dựa trên SERP và NLP',
      keyword: 'Từ khóa mục tiêu',
      contentType: 'Loại nội dung',
      generate: 'Tạo Brief',
      outline: 'Outline đề xuất',
      wordCount: 'Số từ đề xuất',
      relatedTopics: 'Chủ đề liên quan',
    },
    
    contentOptimizer: {
      name: 'Tối ưu Content',
      description: 'Phản hồi realtime về chất lượng nội dung',
      editor: 'Soạn thảo',
      metrics: 'Chỉ số',
      contentScore: 'Điểm nội dung',
      readability: 'Độ dễ đọc',
      suggestions: 'Gợi ý cải thiện',
    },
    
    contentAudit: {
      name: 'Theo dõi Content',
      description: 'Theo dõi hiệu suất và đề xuất cập nhật',
      addContent: 'Thêm nội dung',
      url: 'URL',
      title: 'Tiêu đề',
      lastUpdated: 'Cập nhật lần cuối',
      trafficScore: 'Điểm traffic',
      needsRefresh: 'Cần làm mới',
    },
  },
  
  usage: {
    title: 'Giới hạn sử dụng',
    used: 'Đã dùng',
    remaining: 'Còn lại',
    resets: 'Làm mới vào',
    upgradePrompt: 'Nâng cấp Pro để sử dụng không giới hạn',
  },
  
  payment: {
    title: 'Thanh toán',
    tier: 'Gói',
    amount: 'Số tiền',
    bankTransfer: 'Chuyển khoản ngân hàng',
    instructions: 'Hướng dẫn thanh toán',
    pending: 'Đang chờ xác nhận',
    verified: 'Đã xác nhận',
  },
};
