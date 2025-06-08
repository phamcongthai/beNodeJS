document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('form[action="/search"] input[name="keyword"]');
  
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const keyword = e.target.value.trim();
      console.log('Người dùng gõ:', keyword);

      // Gửi yêu cầu tìm kiếm gợi ý nếu từ khóa không trống
      if (keyword) {
        try {
          const response = await fetch('/search/suggest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword })
          });

          // Kiểm tra nếu response trả về OK (status 200)
          if (response.ok) {
            const data = await response.json();
          } else {
            console.error('Không nhận được dữ liệu gợi ý từ server');
          }
        } catch (error) {
          console.error('Lỗi khi gọi API gợi ý:', error);
        }
      } else {
        console.log('Không có từ khóa tìm kiếm');
      }
    });
  } else {
    console.warn('Không tìm thấy ô tìm kiếm!');
  }
});
