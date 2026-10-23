# Greenwich Todo Lab

Ứng dụng quản lý công việc: thêm, sửa, xóa, đánh dấu hoàn thành, tìm kiếm, lọc và sắp xếp Todo. Dữ liệu được lưu qua JSON Server trong `server/db.json`.

## Công nghệ sử dụng

| Công nghệ                      | Vai trò                                         |
| ------------------------------ | ----------------------------------------------- |
| React 19 + TypeScript          | Xây dựng giao diện và định nghĩa kiểu dữ liệu.  |
| Vite 6                         | Chạy web khi phát triển và build ứng dụng.      |
| Tailwind CSS 4 + Radix UI      | Định dạng và xây dựng các thành phần giao diện. |
| React Hook Form + Yup          | Quản lý biểu mẫu và kiểm tra dữ liệu nhập.      |
| Lucide React, Sonner, date-fns | Biểu tượng, thông báo và xử lý ngày tháng.      |
| JSON Server                    | REST API giả lập, đọc và ghi dữ liệu JSON.      |
| Concurrently                   | Chạy web và API cùng lúc.                       |
| Vitest + Testing Library       | Kiểm thử logic và giao diện React.              |
| ESLint + Prettier              | Kiểm tra và định dạng mã nguồn.                 |

## Cấu trúc và vai trò các thư mục

```text
.
├── server/
│   └── db.json              # Dữ liệu Todo được JSON Server đọc/ghi
├── src/
│   ├── app/                 # Giao diện ứng dụng chính và bài kiểm thử
│   ├── components/
│   │   └── ui/              # Thành phần giao diện dùng chung
│   ├── features/
│   │   └── todos/
│   │       ├── components/  # Form, thẻ công việc, hộp thoại xác nhận
│   │       ├── hooks/       # Hook quản lý dữ liệu và thao tác Todo
│   │       ├── api.ts       # Các lệnh gọi API Todo
│   │       ├── types.ts     # Kiểu dữ liệu công việc và bộ lọc
│   │       ├── schema.ts    # Quy tắc kiểm tra dữ liệu biểu mẫu
│   │       └── utils.ts     # Hàm hỗ trợ xử lý Todo
│   ├── lib/                 # Tiện ích dùng chung và gọi HTTP
│   ├── test/                # Thiết lập môi trường kiểm thử
│   ├── main.tsx             # Điểm khởi chạy React
│   └── index.css            # CSS và định dạng chung
├── dist/                    # Kết quả được tạo sau khi build
├── node_modules/            # Thư viện được cài bằng npm
├── .env.example             # Mẫu cấu hình địa chỉ API
├── index.html               # Trang HTML gốc để gắn ứng dụng React
├── package.json             # Thư viện và các lệnh npm
├── package-lock.json        # Khóa phiên bản thư viện
├── vite.config.ts           # Cấu hình Vite, React, Tailwind và Vitest
├── tsconfig.json            # Cấu hình TypeScript
├── components.json          # Cấu hình bộ thành phần UI
├── eslint.config.js         # Cấu hình kiểm tra mã nguồn
└── .prettierrc.json          # Cấu hình định dạng mã nguồn
```

Các file `*.test.ts` và `*.test.tsx` nằm cạnh mã nguồn cần kiểm thử. `node_modules/` và `dist/` được tạo tự động, không cần sửa trực tiếp.

## Cài đặt

Yêu cầu: Node.js 22.x và npm. Chạy các lệnh tại thư mục gốc của dự án (thư mục chứa `package.json`), bất kể dự án được lưu ở đâu.

Kiểm tra môi trường:

```powershell
node --version
npm.cmd --version
```

Cài thư viện lần đầu hoặc sau khi tải/copy source sang máy khác:

```powershell
npm.cmd ci --include=dev
```

Lệnh này cài đúng phiên bản trong `package-lock.json`, bao gồm công cụ phát triển cần để chạy dự án.

## Chạy ứng dụng

```powershell
npm.cmd start
```

Lệnh trên chạy đồng thời web Vite và JSON Server:

- **Web:** mặc định tại `http://127.0.0.1:5173`. Mở đúng địa chỉ Vite in trên terminal nếu cổng thay đổi.
- **API Todo:** `http://127.0.0.1:3001/todos`.
- **Dữ liệu:** lưu trong `server/db.json` khi thao tác qua ứng dụng.

Nhấn **Ctrl+C** trong terminal để dừng web và API.

Nếu cần chạy riêng, dùng hai terminal tại thư mục gốc dự án:

```powershell
# Terminal 1: API
npm.cmd run api
```

```powershell
# Terminal 2: web
npm.cmd run dev
```

### Đổi địa chỉ API

Mặc định ứng dụng gọi `http://127.0.0.1:3001`, không cần tạo file môi trường để chạy thông thường. Nếu cần đổi địa chỉ, sao chép `.env.example` thành `.env`, sửa giá trị sau rồi khởi động lại Vite:

```dotenv
VITE_API_URL=http://127.0.0.1:3001
```

Biến này chỉ đổi địa chỉ giao diện gọi tới. Nếu đổi cổng JSON Server, cần sửa cả cổng trong script `api` của `package.json` cho khớp.

## Các lệnh khác

| Lệnh                  | Chức năng                                                         |
| --------------------- | ----------------------------------------------------------------- |
| `npm.cmd run build`   | Kiểm tra TypeScript và build web vào `dist/`.                     |
| `npm.cmd run preview` | Xem thử bản web đã build; cần chạy API riêng để thao tác dữ liệu. |
| `npm.cmd test`        | Chạy bộ kiểm thử một lần.                                         |
| `npm.cmd run lint`    | Kiểm tra mã nguồn bằng ESLint.                                    |
| `npm.cmd run format`  | Định dạng các file bằng Prettier.                                 |

Trên macOS/Linux hoặc terminal hỗ trợ `npm` trực tiếp, thay `npm.cmd` bằng `npm`.

## Lỗi thường gặp

- **`concurrently is not recognized`:** Chạy `npm.cmd ci --include=dev` tại thư mục chứa `package.json`, chờ cài thành công rồi chạy lại `npm.cmd start`. Không cần cài global.
- **Không kết nối được API:** Kiểm tra JSON Server đang chạy ở cổng `3001` và `VITE_API_URL` trỏ đúng địa chỉ API.
- **Cổng `3001` đang được sử dụng:** Dừng tiến trình đang chiếm cổng hoặc đổi cổng trong script `api` và cập nhật `VITE_API_URL` tương ứng.
