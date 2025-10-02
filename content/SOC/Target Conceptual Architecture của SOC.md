
#cyber_security #soc

## **1. Giới thiệu chung**

Ở phần này, mình sẽ cùng bạn tìm hiểu một sơ đồ kiến trúc tổng thể của SOC (Security Operations Center – Trung tâm vận hành an ninh mạng) được gọi là **Target Conceptual Architecture**. Nghe có vẻ “hàn lâm”, nhưng thực chất đây chỉ là bức tranh toàn cảnh cho thấy các thành phần của một SOC hiện đại kết nối và làm việc với nhau như thế nào.

**Tóm tắt:**

Bài viết sẽ lần lượt giải thích từng thành phần trong kiến trúc, cách chúng liên kết, vị trí của SIEM, và vai trò của lớp hạ tầng nền tảng.


---


## **2. Tổng quan Target Conceptual Architecture**

**Tóm tắt:**

Đây là một bản thiết kế mô tả SOC từ góc nhìn “từ trên xuống” (high level). Mục tiêu là cho thấy **luồng dữ liệu**, **các khối chức năng** và **cách chúng giao tiếp với nhau**.

![[Pasted image 20250809101420.png]]

 ---
  
### **2.1 Luồng dữ liệu và các thành phần chính**

Luồng dữ liệu trong kiến trúc này có thể hình dung như một **quy trình sản xuất**:

1. **Thu thập nguyên liệu** – Dữ liệu từ hệ thống nội bộ (On-Premise) và đám mây riêng (Private Cloud).

2. **Làm giàu thông tin** – Sử dụng TIP (Threat Intelligence Platform – Nền tảng tình báo mối đe dọa) để bổ sung ngữ cảnh, thông tin mối đe dọa.
    
3. **Phân tích sâu** – Sử dụng Security Analytics (Phân tích bảo mật) bao gồm tương quan sự kiện (Correlation), EDR (Endpoint Detection and Response – phát hiện và phản hồi điểm cuối), Threat Hunting (săn tìm mối đe dọa).
    
4. **Tự động xử lý** – Automation & Orchestration (SOAR – tự động hóa và điều phối) để thực thi các hành động.
    
5. **Quản lý & báo cáo** – Case Management (Quản lý sự cố) và CSOC Portal (Cổng thông tin SOC) hiển thị báo cáo, dashboard, tìm kiếm.
    
6. **Thực thi** – Enforcement áp dụng biện pháp bảo vệ trên hệ thống mạng, bảo mật, Active Directory.  

**Ghi nhớ:**

Dòng chảy dữ liệu cơ bản là:
**Data Sources → TIP → Security Analytics → SOAR → Enforcement / CSOC Portal**
(Case Management kết nối với SOAR để quản lý sự cố).


---


## **3. Vai trò của từng khối trong kiến trúc**

### **3.1 Hạ tầng nền tảng (Infrastructure)**

**Tóm tắt:**
Đây là lớp nền móng đảm bảo toàn bộ SOC hoạt động trơn tru và an toàn.

**Chi tiết:**

- **LDAP/MFA/SSO**: Xác thực tập trung, đăng nhập một lần, bảo mật đa yếu tố.
    
- **NTP**: Đồng bộ thời gian giữa tất cả thiết bị, cực quan trọng cho việc tương quan log.
    
- **Email**: Gửi cảnh báo và thông báo sự cố.
    
- **Endpoint Security**: Bảo vệ máy trạm và server, cung cấp dữ liệu đầu vào cho SIEM.
    
- **Collaboration**: Công cụ trao đổi nội bộ như Teams, Slack.
    
- **Configuration/Software Management**: Quản lý cấu hình và cập nhật hệ thống.
    
- **Backup**: Lưu trữ dự phòng dữ liệu và cấu hình quan trọng.
    
- **Network & Network Security**: Đảm bảo kết nối và bảo mật luồng dữ liệu.
    
- **Compute & Storage**: Nguồn tài nguyên tính toán và lưu trữ log.
    
- **Workstation/VDI**: Nơi analyst thao tác.  

**Ví dụ thực tế:**

Nếu NTP (đồng bộ thời gian) bị lệch 5 phút giữa các máy, SIEM có thể coi một chuỗi tấn công là các sự kiện rời rạc, khiến analyst bỏ lỡ mối liên hệ.

**Ghi nhớ:**

Hạ tầng yếu → SOC hoạt động kém hiệu quả, dễ mất dữ liệu hoặc xử lý sai.

---

### **3.2 Nguồn dữ liệu (Data Sources)**

Bao gồm log và sự kiện từ hệ thống On-Premise và Private Cloud. Đây là nguyên liệu đầu vào của SOC.

---

### **3.3 Nền tảng tình báo mối đe dọa (TIP)**

TIP nhận dữ liệu từ nhiều nguồn tình báo (TI feeds), phân tích sandbox, và nguồn nội bộ/ngoại bộ để làm giàu dữ liệu sự cố.

---

### **3.4 Phân tích bảo mật (Security Analytics)**

Chứa SIEM và các module nâng cao:

- **Correlation**: Ghép nối sự kiện từ nhiều nguồn.
    
- **EDR**: Phát hiện và phản hồi điểm cuối.
    
- **Threat Hunting**: Chủ động tìm kiếm mối đe dọa.

---

### **3.5 Tự động hóa và điều phối (SOAR)**

SOAR nhận kết quả phân tích từ SIEM, tự động chạy playbook để xử lý hoặc gửi lệnh thực thi.

---

### **3.6 Quản lý sự cố (Case Management)**

Ghi nhận, theo dõi, và điều phối xử lý các sự cố bảo mật.

---

### **3.7 Thực thi (Enforcement)**

Áp dụng hành động bảo vệ trên hạ tầng: chặn IP, khóa tài khoản AD, thay đổi cấu hình mạng…

---

### **3.8 Cổng thông tin SOC (CSOC Portal)**

Giao diện tập trung cho analyst theo dõi báo cáo, dashboard, tìm kiếm, và kiểm tra tuân thủ.


---


## **4. SIEM nằm ở đâu trong kiến trúc này?**

SIEM nằm **bên trong khối Security Analytics**, ở phần **Correlation** và **Threat Hunting**. Nó là công cụ trung tâm thu thập, lưu trữ, tìm kiếm log, phân tích và tạo cảnh báo.

So sánh nhanh:

|**Thành phần**|**Chức năng chính**|
|---|---|
|SIEM|Thu thập, lưu trữ, tìm kiếm, phân tích log|
|Security Analytics|Gồm SIEM + các phân tích nâng cao (EDR, Hunting)|


---


## **5. Chốt lại kiến thức**

- **Hạ tầng nền tảng** là móng của SOC, không ổn định thì các khối khác khó hoạt động chính xác.
    
- **SIEM** chính là một phần của Security Analytics, tập trung vào thu thập và phân tích log.
    
- **Luồng dữ liệu SOC** cơ bản: Data Sources → TIP → Security Analytics → SOAR → Enforcement/Portal.
    
- **Case Management** đóng vai trò quản lý toàn bộ vòng đời sự cố, kết nối với SOAR.

![[Pasted image 20250809101716.png]]