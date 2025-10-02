
#cyber_security #soc #incident_response #nist
### **1. Giới thiệu chung**

**Tóm tắt nội dung chính**

Phần này giúp ta hiểu: tại sao NIST lại soạn thảo tài liệu này, ai nên đọc nó và cách nó được tổ chức ra sao. Đây là phần “đặt nền móng” trước khi đi sâu vào kỹ thuật xử lý sự cố (incident handling).

---

#### **1.1 Thẩm quyền và vai trò của NIST**

**NIST (National Institute of Standards and Technology)** là một tổ chức thuộc chính phủ Hoa Kỳ, có trách nhiệm thiết lập các tiêu chuẩn và hướng dẫn để đảm bảo an ninh thông tin cho các cơ quan liên bang Mỹ, theo luật **FISMA (Federal Information Security Management Act)**.

Mặc dù đối tượng chính là các cơ quan chính phủ, nhưng tài liệu của NIST cũng rất hữu ích cho các tổ chức tư nhân và quốc tế – miễn là họ có nhu cầu thiết lập năng lực xử lý sự cố chuyên nghiệp và hiệu quả.

👉 **Ứng dụng thực tế:**

Nếu bạn làm ở ngân hàng, công ty công nghệ, cơ quan nhà nước, hay bất kỳ đơn vị nào có hệ thống CNTT quan trọng, bạn đều có thể dựa vào tài liệu này để xây dựng **quy trình xử lý sự cố** cho tổ chức mình – thay vì “chữa cháy” theo kiểu ngẫu hứng.

---

#### **1.2 Mục đích và phạm vi tài liệu**

Mục tiêu chính của tài liệu này là:
- Hướng dẫn các tổ chức **xây dựng năng lực phản ứng sự cố (Incident Response Capability)**
- Đưa ra quy trình **phát hiện, phân tích, xử lý và phục hồi sau sự cố**
- Cung cấp các lời khuyên áp dụng được với nhiều nền tảng công nghệ khác nhau

Điểm hay là tài liệu không bó buộc theo một hệ điều hành hay phần mềm cụ thể – tức là dù bạn dùng Windows, Linux, hệ thống máy chủ vật lý hay cloud, bạn đều có thể áp dụng được.

👉 **Ứng dụng thực tế:**

Nhiều tổ chức ở Việt Nam khi bị tấn công (ví dụ: mã hóa tống tiền – ransomware) thường **không biết phải làm gì trước**. Tài liệu này cung cấp một **khung chuẩn** để không hoảng loạn và xử lý bài bản, ví dụ: xác định sự cố, cách cô lập, thu thập bằng chứng, thông báo, phục hồi,…

---

#### **1.3 Đối tượng người đọc**

Tài liệu này hướng đến nhiều vai trò khác nhau trong tổ chức:
- **CSIRT/IR team**: Đội xử lý sự cố
- **Sysadmin/Netadmin**: Quản trị hệ thống và mạng
- **CISO/CIO**: Lãnh đạo về an toàn thông tin
- **IT Helpdesk**: Bộ phận hỗ trợ người dùng
- **Pháp lý, truyền thông nội bộ**: Có thể liên quan trong các giai đoạn thông báo hoặc hậu sự cố
  
👉 **Ứng dụng thực tế:**

Ngay cả khi bạn **không phải chuyên gia bảo mật**, việc hiểu được các bước xử lý sự cố sẽ giúp bạn **phối hợp tốt hơn** khi khủng hoảng xảy ra. Ví dụ: nếu bạn là quản lý dự án hoặc giám đốc IT, bạn cần biết khi nào nên báo cho ai, cần báo cáo những gì, và nên tránh hành động gì gây ảnh hưởng bằng chứng.

---

#### **1.4 Cấu trúc tài liệu**

Tài liệu gồm 4 phần chính và nhiều phụ lục:
- **Phần 2**: Tổ chức năng lực xử lý sự cố (chính sách, đội ngũ, quy trình)
- **Phần 3**: Các bước xử lý sự cố (phát hiện, phân tích, phản ứng, phục hồi)
- **Phần 4**: Phối hợp và chia sẻ thông tin
- **Phụ lục**: Tình huống thực tế, dữ liệu cần thu thập, FAQ, công cụ tham khảo,…

👉 **Ứng dụng thực tế:**

Nếu bạn được giao nhiệm vụ viết **kế hoạch xử lý sự cố** cho công ty, thì đây là tài liệu có thể dùng làm xương sống. Chỉ cần theo dõi đúng các phần, bạn sẽ biết phải có gì trong **chính sách**, **quy trình**, cần xây dựng đội ngũ ra sao và tập huấn thế nào.


---


### **2. Tổ chức năng lực phản ứng sự cố (Incident Response Capability)**

**Tóm tắt nội dung chính**

Phần này trình bày lý do tổ chức cần xây dựng một đội ngũ và quy trình để xử lý các sự cố an ninh mạng. NIST không chỉ nói về mặt kỹ thuật, mà còn đề cập đến **chính sách, mô hình tổ chức, nhân sự và phối hợp nội bộ**.

---

#### **2.1 Phân biệt Sự kiện (Event) và Sự cố (Incident)**

Đây là một trong những khái niệm dễ gây nhầm lẫn nhất khi mới tiếp cận chủ đề xử lý sự cố.

**Event (Sự kiện) là gì?**

> **Event** là bất kỳ hoạt động nào có thể quan sát được trên hệ thống hoặc mạng. Nó **không nhất thiết là xấu**.

Ví dụ:
- Người dùng đăng nhập vào hệ thống → là một event.
- Máy chủ nhận yêu cầu truy cập web → cũng là một event.
- Firewall chặn một gói tin đáng ngờ → cũng là một event.

**Incident (Sự cố) là gì?**

> **Incident** là khi xảy ra **vi phạm hoặc đe dọa đến việc vi phạm** các chính sách an ninh thông tin, hoặc các hành vi sử dụng hệ thống sai quy định.

Một sự kiện chỉ được gọi là **sự cố** khi:
- Nó gây ra hậu quả về an toàn thông tin (mất mát, xâm nhập, tấn công,…)
- Nó **có khả năng gây ra vi phạm** (ví dụ: hacker đang dò quét lỗ hổng)

**So sánh nhanh: Event vs Incident**

|**Tiêu chí**|**Event (Sự kiện)**|**Incident (Sự cố)**|
|---|---|---|
|Tính chất|Trung lập, có thể bình thường hoặc bất thường|Luôn là hành vi gây nguy hại hoặc vi phạm|
|Tần suất|Diễn ra liên tục hàng giờ|Ít hơn, nhưng có ảnh hưởng lớn hơn|
|Ví dụ|Người dùng đăng nhập, firewall log, ping,…|Ransomware tấn công hệ thống, đánh cắp dữ liệu, phishing…|
|Phản ứng|Chưa cần phản ứng|Cần xử lý khẩn cấp hoặc có quy trình rõ ràng|

👉 **Ứng dụng thực tế:**

Tổ chức cần có các công cụ như **SIEM** hoặc **Hệ thống giám sát log** để lọc ra hàng ngàn **event**, từ đó phát hiện đâu là **incident**. Điều này giúp tránh **báo động giả (false positives)** và không bỏ sót sự cố nghiêm trọng.

---

#### **2.2 Vì sao cần phản ứng sự cố (Why Incident Response is Necessary)**

**Vấn đề đặt ra**

Trong thời đại ngày nay, hầu như tổ chức nào cũng có thể bị:
- Tấn công mạng
- Mất dữ liệu khách hàng
- Lộ thông tin cá nhân
- Gián đoạn dịch vụ do virus hoặc DDoS

Vì vậy, không thể chỉ “hy vọng là không có gì xảy ra” mà cần chuẩn bị trước để **phản ứng kịp thời khi sự cố xảy ra**.

**Lợi ích của việc xây dựng năng lực phản ứng sự cố**

1. **Giảm thiểu thiệt hại**
    - Xử lý nhanh giúp giảm thời gian dịch vụ bị gián đoạn, giảm mất mát dữ liệu.
2. **Tuân thủ pháp lý**
    - Đối với các tổ chức chính phủ và tài chính, luật yêu cầu phải có đội xử lý sự cố và báo cáo định kỳ (ví dụ: FISMA, OMB A-130 ở Mỹ).
3. **Chuẩn hóa phản ứng**
    - Có quy trình giúp nhân viên không lúng túng, biết nên báo cáo cho ai, làm gì trước tiên.
4. **Phân tích để cải thiện**
    - Mỗi sự cố là một “bài học” quý. Ghi lại sự cố và rút kinh nghiệm sẽ giúp tổ chức ngày càng vững chắc hơn.
5. **Phòng ngừa tốt hơn**
    - Khi đã xử lý một sự cố, tổ chức sẽ dễ phát hiện những điểm yếu tồn tại để khắc phục sớm hơn.

👉 **Ví dụ thực tế:**
- **Một ngân hàng bị gửi email phishing đến nhân viên.** Nếu không có đội IR theo dõi, email sẽ lọt vào và người dùng bấm vào link → lộ thông tin.
- Nhưng nếu đã có quy trình:
    - Có hệ thống phát hiện email lạ
    - Nhân viên được đào tạo báo cáo kịp thời
    - Đội IR can thiệp sớm: chặn tên miền, reset mật khẩu, cảnh báo toàn công ty
        → Nguy cơ bị đánh cắp tiền hoặc dữ liệu sẽ giảm mạnh.

---

#### **2.3 Chính sách, kế hoạch và quy trình phản ứng sự cố**

**Tóm tắt nội dung chính**

Không thể phản ứng hiệu quả nếu không có sẵn **chính sách rõ ràng**, **kế hoạch hành động**, và **quy trình chi tiết**. Phần này giúp bạn hiểu tổ chức cần xây dựng gì trước khi sự cố xảy ra, và cụ thể từng tài liệu nên bao gồm những nội dung gì.

---

##### **2.3.1 Nội dung chính sách (Incident Response Policy)**

**Chính sách (Policy)** là văn bản cấp cao nhất, thể hiện **cam kết của lãnh đạo** và quy định những nguyên tắc chung khi xử lý sự cố.

**Các nội dung chính cần có trong chính sách:**
1. **Cam kết của ban lãnh đạo**
    - Xác nhận đây là hoạt động quan trọng, có ngân sách và được ưu tiên.
2. **Mục tiêu chính sách**
    - Bảo vệ tài sản thông tin, giảm thiểu rủi ro và thiệt hại từ sự cố.
3. **Phạm vi áp dụng**
    - Áp dụng cho tất cả hệ thống, người dùng, nhà cung cấp,… có liên quan đến tài nguyên thông tin.
4. **Định nghĩa sự cố và các thuật ngữ**
    - Để đảm bảo ai cũng hiểu đúng về “incident”, “event”, “breach”…
5. **Vai trò, trách nhiệm, quyền hạn**
    - Ai là người được phép ra quyết định ngắt kết nối?
    - Ai được phép thu thập log hoặc tiếp cận dữ liệu nhạy cảm?
    - Phân định rõ vai trò giữa CSIRT, IT, pháp lý, HR,…
6. **Phân loại mức độ sự cố**
    - Theo mức độ nghiêm trọng để ưu tiên xử lý.
7. **Chỉ số đo lường hiệu quả**
    - Ví dụ: thời gian phản hồi trung bình, số sự cố đã xử lý đúng hạn,…
8. **Mẫu biểu báo cáo và liên hệ**
    - Có form chuẩn để ghi nhận sự cố, báo cáo, liên lạc,…

👉 **Ứng dụng thực tế:**

Khi xảy ra sự cố, nếu không có chính sách rõ ràng thì rất dễ **rối loạn trách nhiệm**, ai cũng sợ đụng vào. Có chính sách rồi thì việc xử lý có thể được thực thi nhanh gọn, đúng quyền hạn.

---

##### **2.3.2 Nội dung kế hoạch (Incident Response Plan – IRP)**

**Kế hoạch (Plan)** là văn bản cụ thể hóa chính sách – hướng dẫn tổ chức làm thế nào để xây dựng, duy trì và cải tiến năng lực phản ứng sự cố.

**Các thành phần chính của kế hoạch:**
1. **Sứ mệnh và mục tiêu của đội IR**
    - Ví dụ: “Đảm bảo thời gian phản hồi sự cố nghiêm trọng dưới 4 giờ”
2. **Chiến lược và mục tiêu dài hạn**
    - Nâng cấp công cụ, huấn luyện định kỳ, mở rộng đội ngũ, phối hợp với bên ngoài,…
3. **Được lãnh đạo phê duyệt**
    - Là cơ sở để xin ngân sách, nhân sự và thực thi.
4. **Mô hình đội phản ứng sự cố**
    - Trung tâm tập trung (centralized) hay phân tán (distributed)?
    - Làm việc 24/7 hay chỉ trong giờ hành chính?
5. **Cách liên lạc nội bộ và bên ngoài**
    - Có sẵn danh sách liên hệ khẩn cấp (email, điện thoại, người thay thế,…)
6. **Tiêu chí đo lường hiệu quả kế hoạch**
    - Ví dụ: % sự cố được xử lý trong SLA, % bài học rút ra sau mỗi sự cố,…
7. **Lộ trình nâng cao năng lực phản ứng sự cố**
    - Đào tạo, diễn tập, cập nhật SOP, áp dụng công cụ SIEM,…

👉 **Ứng dụng thực tế:**

Khi công ty bị mã hóa toàn bộ dữ liệu bởi ransomware, một kế hoạch tốt sẽ giúp biết ngay:
- Ai được quyền ngắt kết nối hệ thống?
- Có bản backup không? Nằm ở đâu?
- Ai thông báo cho lãnh đạo? Cho khách hàng?

---

##### **2.3.3 Nội dung quy trình (Procedure – SOP)**

**Quy trình (Standard Operating Procedures – SOP)** là hướng dẫn cụ thể các bước cần làm trong từng tình huống cụ thể.

**Nội dung cần có trong SOP:**
1. **Quy trình phát hiện và báo cáo sự cố**
    - Nhân viên phát hiện → Báo cho bộ phận nào? Bằng hình thức nào?
2. **Quy trình phân tích và xác nhận sự cố**
    - Ai phân tích log? Dựa vào công cụ nào? Bao lâu phải phản hồi?
3. **Quy trình phân loại và đánh giá mức độ nghiêm trọng**
    - Sự cố có ảnh hưởng đến dữ liệu khách hàng? Có lan rộng không?
4. **Quy trình phản ứng: cô lập, xử lý, phục hồi**
    - Khi nào cần ngắt kết nối? Khôi phục hệ thống từ đâu?
5. **Quy trình ghi nhận và lưu giữ bằng chứng**
    - Có mẫu checklist nào? Ai phụ trách ghi log và chụp màn hình?
6. **Quy trình thông báo nội bộ và bên ngoài**
    - HR, pháp lý, truyền thông có vai trò gì?
7. **Quy trình tổ chức lessons learned**
    - Sau mỗi sự cố, tổ chức họp đánh giá, rút kinh nghiệm, cập nhật SOP.

👉 **Ứng dụng thực tế:**

SOP giúp mọi người **không bị rối** khi xảy ra khủng hoảng. Ví dụ:
- Một server bị nghi nhiễm mã độc → SOP hướng dẫn cụ thể: ai vào xem log, ai tách máy ra khỏi mạng, ai phụ trách thông báo, ai giữ nguyên hiện trạng để phục vụ forensics,…

---

##### **2.3.4 Chia sẻ thông tin với bên ngoài**

Chia sẻ thông tin khi xảy ra sự cố là việc **rất nhạy cảm** nhưng cũng rất cần thiết. Nếu làm không đúng, bạn có thể:
- Vi phạm pháp luật (về bảo mật dữ liệu cá nhân)
- Làm lộ thông tin nhạy cảm cho kẻ tấn công
- Gây mất niềm tin từ khách hàng hoặc đối tác

**Nội dung cần chuẩn bị trong chính sách chia sẻ thông tin:**
1. **Các bên ngoài cần chia sẻ**
    - Pháp luật: công an, Cục An toàn thông tin
    - Đối tác kỹ thuật: ISP, nhà cung cấp phần mềm
    - Khách hàng bị ảnh hưởng
    - Truyền thông đại chúng (nếu cần thiết)
2. **Quy tắc chia sẻ**
    - Ai được phép chia sẻ? Qua kênh nào?
    - Chia sẻ thông tin nào và mức độ chi tiết ra sao?
    - Cần có chữ ký số, email mã hóa hoặc NDA (hợp đồng bảo mật) không?
3. **Các tình huống nên chia sẻ**
    - Phát hiện mã độc mới lây lan qua email
    - Phát hiện tài khoản bị đánh cắp từ hệ thống bên ngoài
4. **Kịch bản phối hợp**
    - Cần diễn tập trước với các bên ngoài để tránh lúng túng thật sự

👉 **Ứng dụng thực tế:**

Trong một công ty thương mại điện tử, nếu có dấu hiệu **lộ thông tin thẻ tín dụng khách hàng**, bộ phận phản ứng sự cố phải biết:
- Có nghĩa vụ báo cáo vụ việc cho **Cục An toàn thông tin**, hoặc ngân hàng?
- Có phải thông báo cho khách hàng không?
- Có thể chia sẻ hash của mã độc cho đội CERT để cùng phân tích không?

---

#### **2.4 Cấu trúc đội ngũ phản ứng sự cố (Incident Response Team Structure)**

**Tóm tắt nội dung chính**

Đội phản ứng sự cố là “bộ não hành động” khi sự cố xảy ra. Phần này sẽ giúp bạn hiểu có những **mô hình tổ chức đội IR nào**, **cách chọn mô hình phù hợp**, và **các kỹ năng cần có trong đội**. Quan trọng hơn, làm sao để phối hợp tốt với các phòng ban còn lại trong công ty.

---

##### **2.4.1 Các mô hình đội ngũ (IR Team Models)**

Tùy theo quy mô, lĩnh vực và ngân sách, tổ chức có thể chọn 1 trong 3 mô hình sau:

**1. Centralized (Tập trung)**

Toàn bộ đội IR đặt tại một đơn vị chính – thường là trụ sở hoặc trung tâm CNTT.
- **Ưu điểm**: Dễ quản lý, đồng bộ quy trình, tiết kiệm chi phí
- **Nhược điểm**: Thiếu linh hoạt nếu có nhiều chi nhánh hoặc vùng hoạt động khác nhau

👉 Phù hợp với: doanh nghiệp nhỏ, vừa; tổ chức chỉ hoạt động ở 1-2 địa điểm.

**2. Distributed (Phân tán)**

Các chi nhánh hoặc khu vực tự có đội IR riêng, báo cáo về trung tâm điều phối.
- **Ưu điểm**: Phản ứng nhanh tại chỗ, có hiểu biết đặc thù từng khu vực
- **Nhược điểm**: Dễ thiếu đồng bộ, khó duy trì chất lượng nhân sự đồng đều

👉 Phù hợp với: tập đoàn lớn, ngân hàng có chi nhánh toàn quốc, doanh nghiệp đa quốc gia.

**3. Coordinated/Hybrid (Phối hợp hoặc kết hợp)**

Kết hợp cả 2: có đội IR trung tâm và các đầu mối kỹ thuật tại các bộ phận/chi nhánh.
- **Ưu điểm**: Cân bằng giữa quản lý và phản ứng nhanh
- **Nhược điểm**: Cần quy trình phối hợp tốt, rõ vai trò từng cấp

👉 Phù hợp với: tổ chức có ngân sách tốt, cần vừa kiểm soát vừa linh hoạt.

---

##### **2.4.2 Cách chọn mô hình phù hợp**

Để chọn mô hình phù hợp, hãy trả lời 3 câu hỏi sau:

|**Câu hỏi**|**Nếu câu trả lời là…**|**Gợi ý mô hình**|
|---|---|---|
|Công ty bạn hoạt động ở nhiều nơi?|Có → cần phản ứng nhanh ở địa phương|Distributed hoặc Hybrid|
|Có đủ ngân sách và nhân sự chuyên biệt?|Có → có thể xây đội riêng từng nơi|Distributed hoặc Hybrid|
|Muốn kiểm soát tập trung, giảm chi phí?|Có → muốn quy trình rõ ràng, tiết kiệm|Centralized|

👉 **Ví dụ thực tế**:

- **Startup CNTT nhỏ** → Chọn **centralized**, thuê 1-2 người IR chính.
- **Ngân hàng lớn với 100 chi nhánh** → Chọn **hybrid**, mỗi vùng có focal point, nhưng vẫn báo về SOC trung tâm.
- **Tập đoàn đa quốc gia** → Chọn **distributed**, mỗi quốc gia có một CSIRT.

---

##### **2.4.3 Thành phần và kỹ năng nhân sự**

Một đội IR hiệu quả không chỉ cần người biết kỹ thuật – mà còn cần cả những vai trò **hỗ trợ, điều phối, pháp lý**…

**Vai trò và kỹ năng chính:**

|**Vai trò**|**Kỹ năng cần có**|
|---|---|
|**Incident Handler**|Phân tích log, điều tra forensics, viết báo cáo sự cố|
|**Team Lead**|Quản lý sự kiện, điều phối công việc, giao tiếp với lãnh đạo|
|**Forensics Analyst**|Thu thập bằng chứng, phân tích hình ảnh hệ thống, malware|
|**Threat Analyst**|Theo dõi IOC, tình hình threat intelligence|
|**Communications Officer**|Giao tiếp nội bộ, thông báo sự cố, truyền thông công chúng|
|**Pháp lý (Legal)**|Xác định nghĩa vụ pháp lý khi lộ dữ liệu, xử lý bằng chứng|
|**HR / Compliance**|Phối hợp điều tra khi liên quan đến nhân sự nội bộ|

👉 **Ứng dụng thực tế:**
- Nhân viên IR nên được huấn luyện định kỳ về: nhận diện phishing, điều tra malware, forensics cơ bản, dùng SIEM, dùng Splunk, ELK,…
- Nên có **sơ đồ thay thế (backup)** phòng khi người chính vắng mặt trong tình huống khẩn cấp.

---

##### **2.4.4 Sự phối hợp nội bộ (Internal Coordination)**

Đội IR không thể hoạt động đơn độc. Khi xảy ra sự cố, cần phối hợp với:

**Các bộ phận cần phối hợp:**

1. **IT Operations**
    - Giúp cô lập máy, khôi phục hệ thống, cấp quyền truy cập
2. **Security Team**
    - Phân tích log, hỗ trợ điều tra kỹ thuật chuyên sâu
3. **Helpdesk / Support**
    - Nhận thông báo ban đầu từ người dùng, hướng dẫn thao tác
4. **Pháp lý & HR**
    - Hỗ trợ xử lý liên quan đến hành vi nhân viên, quy định luật
5. **Truyền thông nội bộ & PR**
    - Đảm bảo thông tin ra ngoài được kiểm soát và chính xác

👉 **Kỹ thuật phối hợp hiệu quả:**
- Xây dựng **sơ đồ liên lạc khẩn cấp**
- Diễn tập xử lý sự cố định kỳ với tất cả bộ phận liên quan
- Dùng **playbook** rõ ràng: “ai làm gì khi sự cố X xảy ra”

---

#### **2.5 Các dịch vụ mà đội phản ứng có thể cung cấp (Services Provided by the IR Team)**

**Tóm tắt nội dung chính**

Đội phản ứng sự cố không chỉ đơn thuần “dập lửa khi cháy” – mà còn có thể cung cấp rất nhiều dịch vụ **phòng ngừa, tư vấn và hỗ trợ an toàn thông tin**, góp phần bảo vệ tổ chức một cách chủ động.

---

**Phân loại dịch vụ**

NIST chia dịch vụ của đội IR thành 3 nhóm:

##### **2.5.1. Dịch vụ phản ứng (Reactive Services)**

Đây là nhiệm vụ “cốt lõi” – xử lý khi sự cố thực sự xảy ra.

|**Dịch vụ**|**Mô tả thực tế**|
|---|---|
|**Xử lý sự cố (Incident Handling)**|Phát hiện – phân tích – xử lý – phục hồi – lessons learned|
|**Điều phối khẩn cấp**|Làm đầu mối điều phối khi khủng hoảng diễn ra|
|**Thu thập bằng chứng**|Forensics, lưu trữ log, hỗ trợ điều tra nội bộ hoặc pháp lý|

👉 **Ví dụ:** Khi bị ransomware, đội IR sẽ tách máy bị nhiễm, phân tích mã độc, phục hồi từ backup, viết báo cáo,…

---

##### **2.5.2. Dịch vụ phòng ngừa (Proactive Services)**

Giúp tổ chức sẵn sàng ứng phó và giảm nguy cơ bị tấn công.

|**Dịch vụ**|**Mô tả thực tế**|
|---|---|
|**Đào tạo và nâng cao nhận thức**|Tổ chức workshop về phishing, social engineering,…|
|**Phân tích lỗ hổng**|Hỗ trợ scan hệ thống, phát hiện điểm yếu bảo mật|
|**Đánh giá log định kỳ**|Kiểm tra các dấu hiệu bất thường trong log hệ thống|
|**Xây dựng playbook và SOP**|Cung cấp quy trình phản ứng cho các tình huống điển hình|
|**Thử nghiệm (Diễn tập)**|Tổ chức tabletop exercise, red team vs blue team|

👉 **Ví dụ:** Đội IR tổ chức một cuộc diễn tập “phishing giả định” để kiểm tra mức độ cảnh giác của nhân viên.

---

##### **2.5.3. Dịch vụ hỗ trợ (Security Quality Improvement)**

Tư vấn để nâng cao chất lượng hệ thống bảo mật chung của tổ chức.

|**Dịch vụ**|**Mô tả**|
|---|---|
|**Tư vấn xây dựng chính sách an toàn thông tin**|Hỗ trợ phòng IT hoặc CISO soạn chính sách phản ứng sự cố|
|**Đánh giá và cải tiến hệ thống SIEM**|Hướng dẫn cách lọc log, viết use case hiệu quả|
|**Phân tích xu hướng sự cố**|Rút ra các pattern từ sự cố cũ để phòng ngừa sự cố mới|

👉 **Ví dụ:** Đội IR nhận thấy trong 3 tháng gần nhất có 20 sự cố từ USB dính malware → Kiến nghị ban hành chính sách **cấm cắm USB lạ vào hệ thống**.

---

#### **2.6 Tổng kết và khuyến nghị (Summary and Recommendations)**

**Tóm tắt nội dung chính**

Phần này tổng hợp lại những điểm cốt lõi cần ghi nhớ khi xây dựng và vận hành năng lực phản ứng sự cố trong tổ chức. Đây là kim chỉ nam giúp bạn không bị “lạc hướng”.

**Tổng kết các ý chính**

1. **Xử lý sự cố là một phần quan trọng của an toàn thông tin**
    - Không thể chỉ trông cậy vào tường lửa hay phần mềm diệt virus
2. **Cần xây dựng chính sách, kế hoạch, quy trình rõ ràng**
    - Không có tài liệu – thì không thể phối hợp tốt khi khủng hoảng xảy ra
3. **Tổ chức phải chọn mô hình đội IR phù hợp**
    - Tùy vào quy mô, năng lực và cơ cấu vận hành
4. **Đội IR cần kỹ năng đa dạng và phối hợp chặt chẽ**
    - Gồm kỹ thuật, truyền thông, pháp lý, quản trị và vận hành
5. **Không chỉ “chữa cháy” mà còn phải “phòng ngừa”**
    - Đào tạo, diễn tập, phân tích xu hướng là điều không thể thiếu    


**Khuyến nghị từ NIST**

|**Khuyến nghị**|**Ý nghĩa thực tiễn**|
|---|---|
|**Lãnh đạo cần cam kết từ đầu**|Không có ngân sách và quyền lực thì đội IR sẽ không thể hoạt động hiệu quả|
|**Phải cập nhật tài liệu thường xuyên**|Vì mối đe dọa luôn thay đổi|
|**Đào tạo liên tục**|Không chỉ cho đội IR mà cho cả toàn tổ chức|
|**Xây dựng cơ chế chia sẻ thông tin an toàn**|Giúp phối hợp với bên ngoài như cơ quan chức năng, nhà cung cấp|
|**Đo lường hiệu quả đội IR**|Ví dụ: thời gian phản hồi, số sự cố xử lý thành công,…|


---


### **3. Quy trình xử lý sự cố (Incident Handling Process)**

**Tóm tắt chương**

Chương này đi sâu vào **4 giai đoạn chính** của xử lý sự cố:
1. **Chuẩn bị (Preparation)**
2. **Phát hiện & Phân tích (Detection & Analysis)**
3. **Khoanh vùng, xử lý và phục hồi (Containment, Eradication & Recovery)**
4. **Hậu sự cố (Post-Incident Activity)**

Bước đầu tiên là **chuẩn bị** – nếu làm tốt khâu này, thì khi sự cố xảy ra bạn sẽ **không hoảng loạn** mà biết cần làm gì, ai xử lý, xử lý như thế nào.

---

#### **3.1 Giai đoạn chuẩn bị (Preparation)**

**Tóm tắt nội dung chính**

Chuẩn bị chính là **“vũ khí” sẵn sàng trong kho** để chiến đấu với sự cố khi nó xảy ra. Giai đoạn này bao gồm từ việc thiết lập đội ngũ, công cụ, quy trình đến đào tạo nhận thức cho toàn tổ chức.

---

##### **3.1.1 Sẵn sàng xử lý (Readiness)**

> **Tình huống giả định:**

> Một sáng thứ Hai, nhân viên chăm sóc khách hàng tại một công ty thương mại điện tử nhận ra email trả lời từ khách dường như đã bị thay đổi nội dung – và có một link lạ chèn vào. Không ai biết đây có phải là lỗi kỹ thuật hay là dấu hiệu của hacker? Mọi người rối lên, người thì gửi ticket, người thì gọi hotline nội bộ… nhưng không ai biết chắc: **đây có phải là sự cố không, và nếu có thì ai xử lý?**

Đây là điển hình của một tổ chức **chưa có sự chuẩn bị**.

**Vậy cần chuẩn bị gì?**

**1. Chính sách, kế hoạch, SOP:**
– Như đã nói ở phần 2.3, đây là các tài liệu “định hướng” và “hành động” cho toàn bộ quá trình IR.

**2. Đội ngũ CSIRT hoặc người phụ trách IR:**
– Dù không có hẳn đội riêng, cần chỉ định **focal point** – người chịu trách nhiệm khi có sự cố.

**3. Kênh tiếp nhận và báo cáo sự cố:**
– Ví dụ:
- Email: incident@tencongty.com
- Hotline nội bộ: số điện thoại trực ca
- Mẫu báo cáo ngắn (có mô tả, thời gian, người phát hiện, ảnh minh họa…)

**4. Công cụ hỗ trợ xử lý:**
– SIEM như Splunk, ELK
– Antivirus, EDR như Crowdstrike, SentinelOne
– Ticketing system như Jira, ServiceNow

**5. Quản lý tài sản và baseline hệ thống:**
– Biết mình có những gì thì mới biết cái gì đang bị “không bình thường”.
– Ví dụ: Máy chủ web thường truyền 5GB/ngày, bỗng dưng có 100GB outbound → khả năng cao là bị tấn công.

**6. Bảo mật đầu vào (hardening):**
– Vô hiệu hóa dịch vụ không cần thiết
– Cập nhật bản vá (patching)
– Kiểm soát tài khoản admin

---

##### **3.1.2 Phòng ngừa sự cố (Prevention)**

Phòng ngừa là một phần quan trọng của chuẩn bị. Một tổ chức tốt sẽ cố gắng **giảm khả năng bị tấn công ngay từ đầu**, thay vì chỉ phản ứng sau khi đã có chuyện.

**Các cách phòng ngừa thực tế:**

**1. Đào tạo nhận thức (Security Awareness Training):**

> **Câu chuyện có thật:**

> Một công ty lớn tại Singapore bị lộ thông tin tài khoản quản lý do **trợ lý giám đốc** mở một email giả mạo từ “bộ phận nhân sự”. Dù hệ thống bảo mật rất tốt, nhưng một cú nhấp chuột sai đã mở đường cho hacker.

→ Giải pháp: tổ chức huấn luyện nhận biết email lừa đảo (phishing), khuyến khích nhân viên **báo cáo email lạ thay vì bấm vào.**

**2. Chính sách sử dụng thiết bị cá nhân (BYOD):**

– Nếu nhân viên dùng điện thoại riêng để truy cập email công ty → cần quy định bảo mật rõ ràng: cài passcode, không root, cài phần mềm MDM.

**3. Giới hạn quyền truy cập:**

– Dùng mô hình **least privilege** – chỉ cấp đúng quyền cần thiết, tránh trường hợp tài khoản bị lộ có thể truy cập quá nhiều hệ thống.

**4. Kiểm tra bảo mật định kỳ:**

– Kiểm thử thâm nhập (pentest)

– Đánh giá cấu hình

– Quét lỗ hổng bằng Nessus, OpenVAS,…

---

**Câu chuyện tổng hợp: Công ty A và bài học từ một lần suýt “cháy lớn”**

Công ty A hoạt động trong lĩnh vực fintech, không có đội xử lý sự cố riêng mà giao hết cho team IT lo luôn bảo mật. Một ngày, hệ thống nhận được cảnh báo từ hệ thống giám sát rằng có đăng nhập bất thường từ địa chỉ IP ở Nga vào tài khoản admin.

Cả team loay hoay:
- “Có phải tấn công thật không?”
- “Giờ phải làm gì?”
- “Ngắt mạng hay cứ theo dõi tiếp?”

→ Cuối cùng phải mất hơn 3 tiếng để xác định là **tài khoản bị lộ qua một dịch vụ bên thứ ba.**

Sau vụ việc, công ty:
- Thành lập một nhóm IR nhỏ
- Mua license Splunk + Crowdstrike
- Đào tạo lại nhân viên
- Xây hotline nội bộ và quy trình phản ứng

**Từ đó về sau, chỉ cần 10 phút để xác minh – và cô lập hệ thống nếu có cảnh báo nghiêm trọng.**

---

#### **3.2 Phát hiện và phân tích sự cố (Detection & Analysis)**

**Tóm tắt nội dung chính**

Bạn không thể xử lý sự cố nếu **không phát hiện ra nó**. Đây là giai đoạn xác định xem một sự kiện có thực sự là **sự cố an toàn thông tin hay không**, và nếu có thì **mức độ nghiêm trọng** của nó là gì. Phần này hướng dẫn bạn cách phân tích log, nhận diện dấu hiệu tấn công, và đánh giá rủi ro dựa trên dữ liệu.

---

##### **3.2.1 Các kênh tấn công phổ biến (Attack Vectors)**

Một số con đường mà kẻ tấn công thường lợi dụng để xâm nhập vào hệ thống:

|**Kênh tấn công**|**Mô tả & ví dụ thực tế**|
|---|---|
|**Email (Phishing)**|Giả dạng email từ HR để lừa người dùng bấm vào link độc hại|
|**Web**|Truy cập vào website có chèn mã độc (drive-by download)|
|**USB/Thiết bị ngoại vi**|Nhân viên cắm USB lạ vào máy → bị nhiễm mã độc|
|**Remote Access**|RDP không bảo mật, VPN không MFA|
|**Ứng dụng bị lỗi**|Khai thác lỗ hổng trên các phần mềm lỗi thời (vd: Log4Shell)|
|**Chuỗi cung ứng (Supply Chain)**|Hacker tấn công qua nhà cung cấp phần mềm (như vụ SolarWinds)|

👉 **Thực tiễn:**

Nhiều doanh nghiệp bị tấn công **không phải vì hệ thống yếu**, mà vì một nhân viên click nhầm link, hoặc một nhà cung cấp bên ngoài bị xâm nhập → “mở cửa sau” cho hacker.

---

##### **3.2.2 Dấu hiệu nhận biết sự cố (Signs of an Incident)**

**1. Dấu hiệu rõ ràng (Definitive)**
- File mã độc được phát hiện
- Tài khoản đăng nhập vào lúc 2h sáng từ IP lạ
- Có cảnh báo từ hệ thống SIEM/EDR: “Ransomware Detected”

**2. Dấu hiệu khả nghi (Indicators)**
- CPU/mạng tăng bất thường
- Dữ liệu outbound lớn bất thường
- User gọi hỗ trợ vì “máy chạy chậm bất thường”
- Log ghi nhận hành vi lạ: nhiều lần đăng nhập sai liên tiếp

👉 **Thực tế:**
**Dấu hiệu rõ ràng → Xử lý ngay**
**Dấu hiệu khả nghi → Điều tra thêm trước khi phản ứng**

---

##### **3.2.3 Nguồn thông tin dự đoán và chỉ thị (Sources of Precursors & Indicators)**

**Precursors (Dấu hiệu báo trước)**
- Email đe dọa tấn công hệ thống
- Hacker khoe dữ liệu công ty bạn bị rò rỉ trên darkweb
- Threat Intel feed cảnh báo nhóm APT đang nhắm đến ngành của bạn

**Indicators (Chỉ thị đang xảy ra)**
- Cảnh báo từ SIEM (Splunk, ELK,…)
- EDR phát hiện hành vi bất thường
- Log hệ thống ghi nhận thay đổi quyền truy cập lạ

|**Nguồn thông tin**|**Vai trò**|
|---|---|
|**SIEM/EDR/IDS**|Tự động cảnh báo bất thường|
|**Nhân viên người dùng**|Báo cáo hành vi lạ (máy tự restart, mất file)|
|**Threat Intelligence Feed**|Cung cấp thông tin về lỗ hổng, mã độc, nhóm hacker|
|**Logs hệ thống**|Ghi lại mọi hoạt động: login, network, thay đổi cấu hình|

👉 **Gợi ý:**

Nên có kênh khuyến khích **nhân viên báo cáo nghi ngờ sự cố**, ví dụ như email security@congty.com hoặc biểu mẫu nội bộ.

---

##### **3.2.4 Cách phân tích sự cố (Incident Analysis)**

**Các bước phân tích điển hình:**

1. **Tổng hợp các nguồn cảnh báo**
    - Từ SIEM, người dùng, Threat Intel,…
2. **Tìm dấu hiệu khớp (correlation)**
    - Dùng Splunk/ELK để tìm xem IP A có liên quan đến login nào?
    - Người dùng B có click vào link nào trong email?
3. **Xác minh mức độ đáng tin**
    - Dấu hiệu này là thật hay báo động giả?
4. **Truy tìm root cause**
    - Entry point ban đầu là đâu? Tài khoản bị lộ hay hệ thống bị lỗi?
5. **Ghi nhận timeline sự kiện**
    - Giúp truy ngược và dựng lại diễn biến

**Tình huống minh họa:**

> Splunk cảnh báo có login từ Trung Quốc vào lúc 3h sáng bằng tài khoản admin.
> → SOC Analyst tìm trong log VPN → thấy IP lạ đăng nhập
> → Tra tiếp thấy tài khoản đó được dùng để truy cập database
> → Cross-check threat intel: IP này từng xuất hiện trong nhóm APT27
> → Đánh giá đây là sự cố nghiêm trọng → Bắt đầu giai đoạn phản ứng

---

##### **3.2.5 Ghi chép lại sự cố (Incident Logging)**

Mọi hành động trong quá trình điều tra cần được **ghi lại đầy đủ và có cấu trúc**.

**Nội dung nên có trong log sự cố:**
- Mô tả ngắn gọn sự kiện
- Người phát hiện và thời gian phát hiện
- Ai đã xử lý, vào thời điểm nào
- Phân tích sơ bộ và bước tiếp theo
- Link đến log, ảnh chụp màn hình (screenshot), file .pcap,…

👉 **Thực tiễn:**

Ghi log tốt giúp:
- Tổng hợp bài học rút ra
- Phục vụ pháp lý, bảo hiểm
- Dùng lại cho diễn tập và đào tạo

---

##### **3.2.6 Phân loại mức độ ưu tiên (Incident Prioritization)**

Không phải sự cố nào cũng cần xử lý ngay lập tức. Bạn cần **phân loại để ưu tiên**.

|**Tiêu chí**|**Ví dụ**|
|---|---|
|**Tác động (Impact)**|Có lộ dữ liệu không? Có ảnh hưởng dịch vụ không?|
|**Phạm vi (Scope)**|Một user hay toàn bộ hệ thống bị ảnh hưởng?|
|**Khả năng tái diễn (Likelihood)**|Lỗ hổng này có thể bị khai thác thêm không?|
|**Khung thời gian**|Cần xử lý trong vòng bao lâu?|

**Mức ưu tiên đề xuất:**
- **Cao**: Ransomware, xâm nhập trái phép vào hệ thống core
- **Trung bình**: Malware lẻ, phishing chưa có thiệt hại
- **Thấp**: Báo cáo khả nghi nhưng chưa có dấu hiệu vi phạm

👉 **Gợi ý:**

Có thể dùng bảng đánh giá 3 mức độ (Impact × Likelihood) để quyết định ưu tiên.

---

##### **3.2.7 Gửi thông báo (Incident Notification)**

Khi xác định sự cố, cần **gửi thông báo** kịp thời đến các bên liên quan. Tùy mức độ sự cố, thông báo có thể khác nhau:

|**Đối tượng**|**Nội dung thông báo**|
|---|---|
|**Đội kỹ thuật (IT, SOC)**|Chi tiết kỹ thuật, yêu cầu hành động cụ thể|
|**Lãnh đạo/CISO**|Tình trạng, rủi ro, ảnh hưởng kinh doanh|
|**Pháp lý/HR**|Nếu liên quan đến nhân sự, dữ liệu cá nhân|
|**Người dùng/Khách hàng**|Nếu cần cảnh báo hoặc yêu cầu đổi mật khẩu|
|**Cơ quan nhà nước**|Nếu có nghĩa vụ báo cáo (như lộ thông tin người dùng)|

**Nguyên tắc viết thông báo:**
- **Ngắn gọn – rõ ràng – chính xác**
- Có đầu mối liên hệ để phản hồi
- Không đưa thông tin nhạy cảm qua email

---

#### **3.3 Khoanh vùng, xử lý triệt để và phục hồi (Containment, Eradication & Recovery)**

**Tóm tắt nội dung chính**

Khi sự cố đã được xác nhận, đây là lúc bạn **ra tay hành động**:
- **Khoanh vùng**: Ngăn sự cố lan rộng
- **Xử lý triệt để**: Xóa bỏ tác nhân gây hại
- **Phục hồi**: Khôi phục hệ thống về trạng thái ổn định

Làm không kỹ → hậu quả lặp lại. Làm quá sớm → mất bằng chứng. Làm quá trễ → lan rộng ra toàn hệ thống.

---

##### **3.3.1 Chiến lược khoanh vùng (Containment Strategy)**

**Tại sao cần khoanh vùng sớm?**

> Nếu bạn phát hiện nhà mình đang cháy, việc đầu tiên không phải là “dập ngay lửa” mà là **ngăn đám cháy lan sang nhà hàng xóm**. Trong bảo mật cũng vậy: **containment trước, xử lý sau.**

**Các chiến lược khoanh vùng thường dùng:**

|**Chiến lược**|**Mô tả thực tế**|**Khi nào dùng**|
|---|---|---|
|**Ngắt kết nối mạng**|Rút cáp, chặn IP, cô lập Wi-Fi|Khi sự cố có dấu hiệu lan rộng, mã độc tự lây|
|**Chuyển sang VLAN cô lập**|Đưa hệ thống nghi ngờ sang mạng riêng|Dùng trong môi trường ảo hóa, cloud|
|**Ngắt tài khoản**|Disable user/email nghi ngờ|Khi nghi bị đánh cắp credentials|
|**Chặn dịch vụ cụ thể**|Block port, chặn ứng dụng|Khi chỉ có 1 dịch vụ (vd: RDP) bị khai thác|

**Câu chuyện thực tế:**

> Một công ty logistics phát hiện ransomware đang mã hóa file trên một server.
> Nếu không khoanh vùng sớm, chỉ trong 30 phút, toàn bộ hệ thống có thể **“nằm viện”**.
> → Họ lập tức:
- > Chặn toàn bộ outbound traffic từ subnet bị nhiễm
- > Tạm ngưng backup tự động (tránh backup dữ liệu đã bị mã hóa)
- > Ngắt kết nối máy nghi nhiễm khỏi AD
    > → Giúp ngăn lan rộng và giữ nguyên bằng chứng.

---

##### **3.3.2 Thu thập và bảo quản bằng chứng (Evidence Collection & Preservation)**

**Vì sao cần bảo quản bằng chứng?**
- Phục vụ **điều tra nguyên nhân gốc (root cause)**
- Cần thiết cho **pháp lý hoặc bảo hiểm**
- Giúp **phân tích forensic và threat intel**

**Những gì cần thu thập:**

|**Loại bằng chứng**|**Cụ thể**|
|---|---|
|**File độc hại**|EXE, DLL, JS, v.v. từ máy nghi nhiễm|
|**Memory dump**|RAM tại thời điểm xảy ra sự cố|
|**Network capture**|Gói tin qua Wireshark/tcpdump|
|**Log hệ thống**|Login, event viewer, firewall, VPN, SIEM logs|
|**Lịch sử trình duyệt**|URL, cookie, session – nếu dính đến phishing|

**Nguyên tắc bảo quản:**
- Dùng **hash SHA256** để chứng minh dữ liệu không bị thay đổi
- Ghi lại **người thu thập – thời gian – công cụ – địa điểm**
- Nếu được, nên **sao lưu dữ liệu gốc và phân tích trên bản copy**

👉 **Cảnh báo thực tế:**

Nhiều tổ chức “diệt virus trước – rồi mới điều tra” → Mất hết bằng chứng → Không thể biết root cause và **tấn công lại sau 1 tháng**!

---

##### **3.3.3 Xác định máy chủ tấn công (Identifying Attacking Hosts)**

**Tại sao phải truy ngược?**
- Xác định **entry point ban đầu**
- Biết được hacker đã **làm gì và đi tới đâu**
- Giúp **ngăn chặn các cuộc tấn công tương tự**

**Cách truy vết máy chủ tấn công:**

|**Cách làm**|**Mô tả**|
|---|---|
|**Phân tích log SIEM**|Tìm IP bất thường, hành vi lateral movement|
|**Truy dấu DNS, netflow**|Theo dõi kết nối ra ngoài: kết nối đến C2 server?|
|**Check threat intelligence**|IP/Domain có nằm trong IOC của nhóm APT nào không?|
|**Sandbox mã độc**|Cho file chạy trong môi trường ảo để xem hành vi|

**Ví dụ thực tế:**

> Một server bị nghi nhiễm mã độc. SOC tìm thấy IP 185.**_._**.103 gửi command qua port 443.
- > Cross-check IOC → IP này liên quan đến nhóm APT41
- > Sau đó kiểm tra 5 server khác → thấy cùng connect đến IP đó
    > → Xác định toàn bộ subnet đã bị xâm nhập âm thầm → mở rộng khoanh vùng

---

##### **3.3.4 Khôi phục hệ thống (System Recovery)**

Sau khi đã:
- Ngăn sự cố lan rộng (containment)
- Loại bỏ mã độc, backdoor (eradication)
- Thu thập đủ bằng chứng
→ Bước tiếp theo là **khôi phục hệ thống an toàn và sạch sẽ**.

**Nguyên tắc khôi phục:**

1. **Khôi phục từ backup sạch**
    - Không dùng bản backup đã bị mã độc chạm vào
2. **Đưa vào môi trường sandbox test trước**
    - Khởi động lại máy/ứng dụng trong môi trường kín để chắc chắn không còn mã độc    
3. **Đổi credentials & kiểm tra quyền truy cập**
    - Tất cả tài khoản admin phải được reset và kiểm tra log
4. **Cập nhật bản vá**
    - Lỗi đã bị khai thác phải được vá trước khi vận hành lại
5. **Giám sát tăng cường sau phục hồi**
    - Dùng SIEM/EDR theo dõi sát sao 24-48h đầu sau khi khôi phục

**Tình huống minh họa:**

> Sau khi xử lý mã độc tống tiền, công ty A định khôi phục server từ backup trước đó 3 ngày. Tuy nhiên, họ quên kiểm tra kỹ log và backup đã bị cài shell ngầm → 1 tuần sau hacker quay lại.

→ Bài học: **Không khôi phục vội vàng khi chưa xác nhận an toàn tuyệt đối.**

---

##### **3.3.5 Cân bằng giữa khôi phục nhanh và đảm bảo an toàn**

**Tóm tắt nội dung chính**

Khi hệ thống quan trọng gặp sự cố, doanh nghiệp buộc phải **ra quyết định nhanh chóng**:
- Nếu khôi phục vội → có thể bỏ sót mã độc, làm mất bằng chứng
- Nếu xử lý quá kỹ → dịch vụ ngưng trệ lâu, mất uy tín, thiệt hại doanh thu

Phần này hướng dẫn cách **cân bằng giữa tốc độ và an toàn**, theo mô hình hành động thực tiễn đã được nhiều tổ chức áp dụng thành công.

**Chiến lược đề xuất:**

**1. Tách khôi phục dịch vụ khỏi hệ thống gốc**

Không nên “vá vội” hệ thống bị xâm nhập rồi bật lại. Thay vào đó:

|**Việc cần làm**|**Lý do**|
|---|---|
|Dựng lại hệ thống từ **backup sạch**|Đảm bảo không dính mã độc|
|Khôi phục tạm thời trên **hạ tầng mới**|Cho dịch vụ chạy lại nhanh|
|Giữ nguyên hệ thống bị tấn công|Để phân tích forensic và root cause|

👉 **Thực tế:** Điều này giúp vừa **giảm downtime**, vừa **đảm bảo điều tra đầy đủ**.


**2. Triển khai mô hình “Song song: Clean & Investigate”**

|**Nhánh Clean (khôi phục)**|**Nhánh Investigate (phân tích)**|
|---|---|
|Dựng bản sao hệ thống sạch|Cô lập máy nhiễm|
|Đổi toàn bộ mật khẩu, khóa cổng|Dump RAM, log, hệ thống|
|Giám sát hoạt động sau khôi phục|Tìm backdoor, xác định entry point|

👉 **Lợi ích**: Không ảnh hưởng quá nhiều đến kinh doanh nhưng vẫn xử lý chuyên sâu phía sau.


**3. Ưu tiên khôi phục theo mức độ quan trọng**

Không cần bật lại toàn bộ cùng lúc. Chia hệ thống thành 3 nhóm:

|**Nhóm**|**Ưu tiên khôi phục**|**Ví dụ**|
|---|---|---|
|**Critical**|Ngay lập tức|Cổng thanh toán, dịch vụ khách hàng|
|**Important**|Sau 4–6 giờ|Dashboard quản trị, báo cáo|
|**Non-essential**|Sau 24–48 giờ|Email marketing, thống kê nội bộ|


**4. Kết hợp với kế hoạch BCP & DRP**

- Dự phòng site (DR site)
- Tài khoản khẩn cấp (break-glass account)
- Phương án khôi phục offline tạm thời
- Soạn sẵn kịch bản truyền thông nếu downtime kéo dài

👉 Điều này giúp không phải “ngồi họp rồi mới nghĩ ra giải pháp” trong khủng hoảng.


**5. Ra quyết định dựa trên risk-based approach**

Không có quyết định hoàn hảo – mà có quyết định **phù hợp với rủi ro**.

|**Cân nhắc**|**Ví dụ**|
|---|---|
|Phục hồi sớm có thể bị tái nhiễm?|Nếu root cause chưa xác định|
|Chậm hơn 1 giờ có mất khách hàng không?|Nếu là hệ thống thanh toán|
|Có backup nào thật sự sạch?|Backup hôm qua có bị mã độc không?|

👉 CISO, CTO và team IR nên **ra quyết định cùng nhau**, có tài liệu risk matrix đi kèm.


**Ví dụ minh họa thực tế**

> Một ngân hàng bị lộ tài khoản email nội bộ, hacker dùng để gửi phishing giả mạo giao dịch quốc tế.
> Dịch vụ email cực kỳ quan trọng, nếu tắt 12h sẽ ảnh hưởng đến khách hàng.

✅ Cách xử lý:

- Khóa toàn bộ tài khoản nghi bị lộ
- Mở lại dịch vụ email với chính sách giới hạn: không cho gửi file đính kèm, không gửi external
- Trong lúc đó, team phân tích email bị xâm nhập, thu thập log, trace IP
- Sau 6h khôi phục đầy đủ quyền gửi/nhận khi xác minh hệ thống đã sạch

→ **Tổng downtime: 1.5 giờ** nhưng vẫn thu đủ bằng chứng và ngăn chặn sự cố lan rộng.

---

#### **3.4 Các hoạt động sau sự cố (Post-Incident Activity)**

**Tóm tắt nội dung chính**

Sau khi sự cố đã được xử lý, dịch vụ đã được khôi phục – việc cần làm tiếp theo **không phải là thở phào nhẹ nhõm và quên đi**, mà là nhìn lại, phân tích và học từ chính những gì đã xảy ra.

---

##### **3.4.1 Rút kinh nghiệm (Lessons Learned)**

**Tại sao cần rút kinh nghiệm?**

> “Kẻ thông minh học từ sai lầm của mình. Kẻ khôn hơn học từ sai lầm của người khác. Nhưng kẻ tệ nhất là… không học gì cả.”
> — Trích từ một buổi họp rút kinh nghiệm sau sự cố thật sự.

Việc rút kinh nghiệm sau mỗi sự cố giúp tổ chức:
- Nhận diện lỗ hổng trong quy trình, chính sách, công cụ
- Cải tiến playbook, SOP và nâng cao kỹ năng đội IR
- Tránh lặp lại cùng một lỗi trong tương lai

---

**Cách tổ chức buổi họp Lessons Learned:**

|**Thành phần cần có**|**Vai trò**|
|---|---|
|**Team xử lý sự cố**|Trình bày lại timeline, cách xử lý|
|**Lãnh đạo kỹ thuật/CISO**|Đưa ra quyết định cải tiến, phân bổ nguồn lực|
|**Phòng ban liên quan**|Đóng góp góc nhìn: Helpdesk, Legal, HR,…|

---

**Câu hỏi nên đặt ra trong buổi họp:**

- Phát hiện sự cố có nhanh không? Có thể nhanh hơn không?
- Các bước phản ứng có rõ ràng không? Ai bị động?
- Có hành động nào gây mất bằng chứng không?
- Phối hợp giữa các bộ phận có thông suốt không?
- Dịch vụ khôi phục có đúng hạn không? Có gì đáng lo?

👉 **Gợi ý:** Ghi lại tất cả lesson learned thành **bảng tổng hợp**, gửi toàn team để học tập.

---

##### **3.4.2 Phân tích và tái sử dụng dữ liệu (Data Analysis & Reuse)**

Dữ liệu trong sự cố không chỉ phục vụ điều tra – mà còn là **nguồn nguyên liệu quý giá** cho:

- Cải tiến hệ thống giám sát
- Đào tạo đội SOC
- Viết use case mới cho SIEM
- Cập nhật threat intelligence nội bộ

---

**Ví dụ ứng dụng:**

|**Dữ liệu từ sự cố**|**Có thể tái sử dụng để…**|
|---|---|
|**File mã độc (.exe/.js)**|Cho vào hệ thống sandbox nội bộ để trích hành vi|
|**Log mạng bị khai thác**|Viết use case cảnh báo trong Splunk/ELK|
|**IOC: IP, domain, hash**|Cập nhật vào threat feed nội bộ|
|**Timeline của attacker**|Làm bài huấn luyện SOC: “Dự đoán bước tiếp theo của attacker”|

---

**Tình huống thực tế:**

> Một ngân hàng phát hiện máy chủ bị dùng làm trạm C2 (Command & Control).
> Sau khi xử lý, họ trích toàn bộ log và packet để huấn luyện nhân viên:
> **“Nếu anh/chị là SOC analyst, làm thế nào phát hiện điều này sớm hơn?”**

→ Kết quả: Viết thêm được 3 use case mới cho hệ thống SIEM.

---

##### **3.4.3 Lưu trữ bằng chứng (Evidence Retention)**

**Tại sao cần lưu trữ bằng chứng?**

- Phục vụ pháp lý khi có khiếu kiện, tranh chấp
- Đáp ứng yêu cầu của quy định (vd: ngân hàng, bảo hiểm, PCI DSS)
- Làm cơ sở cho việc báo cáo với cơ quan chức năng

---

**Thời gian lưu trữ gợi ý (tùy ngành):**

|**Loại dữ liệu**|**Thời gian lưu gợi ý**|
|---|---|
|**Log hệ thống**|6 – 12 tháng|
|**Log liên quan sự cố**|1 – 3 năm (nếu nghiêm trọng)|
|**Ảnh snapshot máy bị nhiễm**|Tối thiểu 6 tháng|
|**Memory dump, packet capture**|1 năm nếu có mã độc phức tạp|

👉 **Lưu ý:** Nếu dữ liệu liên quan đến **cá nhân (PII)** → phải tuân thủ **quy định bảo vệ dữ liệu** (như Nghị định 13/2023 tại Việt Nam hoặc GDPR).

---

**Nguyên tắc bảo quản bằng chứng:**

|**Yêu cầu**|**Thực hành**|
|---|---|
|**Nguyên vẹn (Integrity)**|Dùng hash SHA256, lưu dấu vết log truy cập|
|**Bảo mật (Confidentiality)**|Mã hóa và phân quyền truy cập|
|**Có thể kiểm toán (Auditability)**|Lưu lại quá trình xử lý, ai làm gì, khi nào|

---

**Gợi ý cách lưu trữ:**

- Dùng hệ thống **Digital Evidence Locker** (có thể mã hóa và kiểm soát truy cập)
- Tách biệt nơi lưu trữ evidence và hệ thống vận hành
- Có bảng excel mô tả: tên vụ việc, ID, loại file, hash, người phụ trách

---


#### **3.5 Checklist xử lý sự cố**

**Tóm tắt nội dung chính**

Đây là bảng **tổng hợp các bước quan trọng nhất** trong suốt vòng đời xử lý sự cố – từ lúc phát hiện đến khi kết thúc. Một bản checklist tốt giúp:

- **Không bỏ sót bước quan trọng**
- Dễ dàng theo dõi tiến độ xử lý
- Chuẩn hóa quy trình cho mọi loại sự cố

---

**Checklist xử lý sự cố theo NIST SP 800-61r2**

|**Giai đoạn**|**Việc cần làm**|**Đã thực hiện?**|
|---|---|---|
|**1. Chuẩn bị (Preparation)**|||
|– Chính sách & SOP hiện hành|Có ban hành, phổ biến, cập nhật chưa?|[ ]|
|– Đội IR được phân công rõ vai trò|Có danh sách người phụ trách và liên hệ?|[ ]|
|– Công cụ sẵn sàng (SIEM, EDR, forensics)|Đã triển khai và kiểm thử định kỳ?|[ ]|
|**2. Phát hiện & phân tích (Detection)**|||
|– Nhận cảnh báo / báo cáo nghi vấn|Qua SIEM, EDR, Helpdesk, người dùng?|[ ]|
|– Xác nhận dấu hiệu là sự cố hay false positive|Có đủ log, IOC, dữ liệu?|[ ]|
|– Ưu tiên sự cố theo mức độ impact|Ảnh hưởng đến dịch vụ, dữ liệu, uy tín,…?|[ ]|
|**3. Khoanh vùng, xử lý và phục hồi (Contain/Eradicate/Recover)**|||
|– Cô lập hệ thống nghi nhiễm|Tách khỏi mạng, ngắt quyền admin?|[ ]|
|– Thu thập và lưu giữ bằng chứng|RAM, log, file độc hại, hình ảnh máy,…?|[ ]|
|– Xác định nguyên nhân & điểm vào|Phishing? RDP? Lỗ hổng phần mềm?|[ ]|
|– Khôi phục hệ thống sạch|Dựng lại từ backup? Cập nhật bản vá?|[ ]|
|– Tăng cường giám sát sau sự cố|Log alert? Kiểm soát truy cập?|[ ]|
|**4. Sau sự cố (Post-Incident)**|||
|– Tổ chức họp lessons learned|Có phân tích nguyên nhân, lỗ hổng quy trình?|[ ]|
|– Cập nhật playbook / SOP|Có cập nhật nội dung mới từ sự cố vừa xử lý?|[ ]|
|– Lưu trữ bằng chứng và báo cáo đầy đủ|Lưu file, hash, nhật ký, báo cáo sự cố?|[ ]|

👉 **Gợi ý thực tiễn:**
- In ra và dán tại bàn làm việc của đội IR hoặc SOC
- Tích hợp thành checklist số trong hệ thống quản lý sự cố (ticketing)

---

#### **3.6 Tổng kết và khuyến nghị**

**Tóm tắt nội dung chính**

Chương 3 là phần trọng tâm nhất trong toàn bộ tài liệu NIST SP 800-61r2. Nếu coi xử lý sự cố như một “cuộc chiến”, thì chương này là bản **kế hoạch tác chiến chuẩn chỉnh** để mọi tổ chức áp dụng.

---

 **Tổng kết những gì bạn cần nhớ:**

|**Giai đoạn**|**Mục tiêu chính**|
|---|---|
|**Chuẩn bị**|Có sẵn chính sách, đội ngũ, công cụ, SOP|
|**Phát hiện**|Nhận biết sớm qua log, cảnh báo, người dùng|
|**Khoanh vùng**|Ngăn chặn lan rộng, giữ bằng chứng|
|**Xử lý**|Loại bỏ tác nhân, phục hồi hệ thống|
|**Phục hồi**|Đưa dịch vụ hoạt động lại an toàn|
|**Hậu sự cố**|Học hỏi – cải tiến – lưu trữ bằng chứng|

---

**Khuyến nghị từ NIST và kinh nghiệm thực tế**

|**Khuyến nghị**|**Ứng dụng thực tế**|
|---|---|
|Đừng đợi có sự cố mới nghĩ đến quy trình|Phải chuẩn bị từ hôm nay: chính sách, đội ngũ, diễn tập|
|Có tài liệu rõ ràng nhưng cũng phải linh hoạt|Sự cố xảy ra luôn có yếu tố bất ngờ|
|Chia vai trò rõ ràng, không ai “ôm hết”|Một người điều phối – một người kỹ thuật – một người truyền thông|
|Ghi chép mọi thứ, kể cả thao tác nhỏ|Vừa để học, vừa để bảo vệ tổ chức về pháp lý|
|Mỗi sự cố là một bài học miễn phí (nếu học kịp)|Đừng bỏ qua buổi rút kinh nghiệm sau mỗi lần “cháy”|

Xem thêm: [[Playbook xử lý ransomware – Khôi phục nhanh + Forensic]]


---


### **4. Phối hợp và chia sẻ thông tin (Coordination and Information Sharing)**

**Tóm tắt nội dung chính**

Khi xảy ra sự cố, không chỉ team kỹ thuật mới bị ảnh hưởng – mà còn liên quan đến **khách hàng, đối tác, cơ quan nhà nước, truyền thông**. Việc chia sẻ thông tin đúng người, đúng lúc, đúng nội dung là **chìa khóa để kiểm soát tình hình**, tránh khủng hoảng truyền thông, vi phạm pháp lý và mất lòng tin từ cộng đồng.

---

#### **4.1 Phối hợp với các bên liên quan (Coordination)**

##### **4.1.1 Các loại mối quan hệ phối hợp**

|**Bên liên quan**|**Vai trò khi xảy ra sự cố**|
|---|---|
|**Nội bộ (IT, SOC, pháp lý, HR, truyền thông)**|Phối hợp phản ứng, điều tra, truyền thông|
|**Đối tác kỹ thuật (ISP, nhà cung cấp phần mềm)**|Cung cấp thông tin, hỗ trợ khắc phục|
|**Cơ quan quản lý (Cục ATTT, công an, ngân hàng nhà nước)**|Nhận báo cáo bắt buộc, phối hợp điều tra|
|**Khách hàng**|Nhận cảnh báo, hướng dẫn bảo vệ dữ liệu cá nhân|
|**Đội IR quốc gia (VD: VNCERT/CC)**|Hỗ trợ kỹ thuật, phân tích mã độc, chia sẻ IOC|

---

##### **4.1.2 Cần có gì để phối hợp hiệu quả?**

- **Thông tin liên hệ khẩn cấp (Emergency Contact List)**
    → Ví dụ: số hotline nội bộ, email bảo mật, người phụ trách mỗi đơn vị
- **Phân quyền thông tin**: ai được nói gì, với ai
- **Tài liệu mẫu sẵn (template)**: thông báo nội bộ, cho khách hàng, cho báo chí
- **Đào tạo & diễn tập**: tất cả phòng ban đều nên tham gia ít nhất 1 tabletop mỗi năm

👉 **Tình huống thực tế**:

Một sàn thương mại điện tử bị phát hiện rò rỉ dữ liệu tài khoản. Vì không có ai “được phép phát ngôn”, bộ phận chăm sóc khách hàng trả lời sai thông tin → khiến sự cố nhỏ **bị thổi bùng thành khủng hoảng truyền thông**.

---

#### **4.2 Kỹ thuật chia sẻ thông tin (Sharing Techniques)**

##### **4.2.1 Chia sẻ thủ công (Ad Hoc Sharing)**

- Gửi email có mã hóa (PGP/GPG)
- Gọi điện thoại hoặc gặp trực tiếp
- Gửi file bằng công cụ bảo mật (như Google Drive giới hạn quyền, WeTransfer có mật khẩu)

**Ưu điểm:** đơn giản, nhanh

**Nhược điểm:** dễ bị sai sót, khó mở rộng

---

##### **4.2.2 Chia sẻ bán tự động**

- Dùng nền tảng chia sẻ IOC như **MISP**, **OpenCTI**, hoặc **STIX/TAXII**
- Tích hợp SIEM hoặc SOAR để lấy IOC từ cộng đồng

**Ưu điểm:** nhanh, có cấu trúc

**Nhược điểm:** cần thiết lập hạ tầng trước

---

##### **4.2.3 Các vấn đề cần lưu ý khi chia sẻ**

|**Rủi ro**|**Cách giảm thiểu**|
|---|---|
|Lộ thông tin nhạy cảm|Gỡ PII, ẩn thông tin nội bộ trước khi gửi|
|Gửi sai đối tượng|Sử dụng whitelist, có quy trình kiểm duyệt|
|Không đồng nhất định dạng dữ liệu|Chuẩn hóa IOC theo STIX, CSV, JSON,…|

👉 **Mẹo nhỏ**: Luôn đặt tên file, hash, tag rõ ràng để tiện tra cứu về sau.

---

#### **4.3 Chia sẻ thông tin một cách chọn lọc (Selective Sharing)**

Không phải cứ “biết gì thì nói hết” – mà cần chia sẻ **đúng thông tin, đúng người, đúng thời điểm**.

---

##### **4.3.1 Thông tin ảnh hưởng đến doanh nghiệp**

|**Thông tin nào nên giữ kín?**|**Gợi ý xử lý**|
|---|---|
|Số lượng tài khoản bị lộ cụ thể|Chia sẻ nội bộ, báo cáo cơ quan chức năng|
|Lỗ hổng zero-day chưa vá được|Không công khai đến khi có bản vá|
|Quy trình điều tra nội bộ, nhân sự liên quan|Chia sẻ giới hạn trong nhóm quản lý & pháp lý|

---

##### **4.3.2 Thông tin kỹ thuật có thể chia sẻ**

|**Thông tin nào nên chia sẻ rộng rãi?**|**Mục tiêu**|
|---|---|
|IOC: IP, domain, hash mã độc|Để cộng đồng cảnh báo lẫn nhau|
|Hành vi mã độc (behavioral pattern)|Hỗ trợ viết detection rules|
|Timeline tấn công (không chứa PII)|Làm ví dụ training, học tập|

---

**Câu chuyện thực tế:**

> Sau khi bị tấn công bằng một biến thể mới của ransomware, một công ty Fintech đã chia sẻ IOC và hành vi mã độc lên MISP của cộng đồng ngân hàng.
> → 3 ngân hàng khác phát hiện dấu hiệu tương tự trong hệ thống và ngăn chặn sớm, **tránh thiệt hại hàng tỷ đồng.**

---

#### **4.4 Tổng kết và khuyến nghị**

|**Nội dung cần nhớ**|**Ghi nhớ nhanh**|
|---|---|
|Phối hợp nội bộ không rõ ràng|→ dễ phản ứng chậm, trả lời sai thông tin|
|Không nên chia sẻ mọi thứ|→ phải kiểm soát rò rỉ dữ liệu và PII|
|Có công cụ chia sẻ bán tự động|→ giúp tiết kiệm thời gian, chia sẻ hiệu quả|
|Cộng đồng chia sẻ mạnh mẽ|→ cả hệ sinh thái an toàn hơn|
