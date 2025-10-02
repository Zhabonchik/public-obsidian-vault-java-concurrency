#cyber_security #machine_learning 
### **1. Giới thiệu chung**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo Calix giới thiệu tổng quan về khóa học “Machine Learning for Cyber” – một khóa học giúp chúng ta hiểu rõ cách áp dụng các kỹ thuật học máy (machine learning) vào việc giải quyết các bài toán trong lĩnh vực **an ninh mạng (cybersecurity)**. Thầy nêu rõ mục tiêu, các khái niệm chính, công cụ sử dụng và lộ trình học tập.

---

#### **1.1. Mục tiêu bài học**

Sau khi hoàn thành bài học này, người học sẽ:

- Hiểu được **các phương pháp học máy** cơ bản và cách chúng hoạt động.
    
- Biết được **tầm quan trọng của việc lựa chọn đặc trưng (features)** trong dữ liệu.
    
- Nắm được vai trò của **tập dữ liệu (datasets)** và cách chuẩn bị chúng.
    
- Biết lý do tại sao học máy lại **đặc biệt quan trọng trong lĩnh vực an ninh mạng**.
    
- Phân biệt được **deep learning** và **machine learning**.
    
- Có cái nhìn tổng quan về **Big Data (dữ liệu lớn)** và mối quan hệ giữa nó với ML và Cybersecurity.

---

#### **1.2. Các thuật ngữ chính trong bài học**

Trong phần này, thầy đề cập đến một số thuật ngữ quan trọng:

- **Machine Learning (Học máy)**: Các phương pháp giúp máy tính học từ dữ liệu để đưa ra dự đoán hoặc phân loại.
    
- **Cybersecurity (An ninh mạng)**: Lĩnh vực bảo vệ hệ thống máy tính khỏi tấn công, truy cập trái phép hoặc phá hoại.
    
- **Big Data (Dữ liệu lớn)**: Lượng dữ liệu khổng lồ mà máy tính thông thường không xử lý nổi.
    
- **Deep Learning (Học sâu)**: Một nhánh của học máy, sử dụng mạng nơ-ron sâu để xử lý dữ liệu phức tạp.

---

#### **1.3. Các công cụ được sử dụng**

Trong suốt khóa học, người học sẽ làm quen với nhiều công cụ phổ biến trong lĩnh vực học máy và dữ liệu:

- **Ngôn ngữ lập trình**: Python
    
- **Thư viện**: Numpy, Pandas, Sklearn, Tensorflow
    
- **Nền tảng xử lý song song**: Hadoop, Spark
    
- **Hạ tầng tính toán**: AWS (Amazon Web Services), GPU, CPU, TPU

Ví dụ thực tế: Khi huấn luyện mô hình học sâu để phát hiện mã độc, ta có thể dùng TensorFlow để xây dựng mạng nơ-ron và dùng GPU để xử lý nhanh hơn.

---

#### **1.4. Môi trường học tập**

Người học được khuyến nghị sử dụng các công cụ như:

- **Máy ảo (Virtual Machine)**: Ubuntu 14.04 hoặc 16.04 (64-bit), hoặc Mac.
    
- **Framework học máy**: TensorFlow và Scikit-learn
    
- **Nếu xây dựng máy vật lý**: cần CPU mạnh, GPU từ GTX 980 trở lên, RAM ít nhất 32GB, ổ SSD 1TB – tổng chi phí khoảng $1,500 - $2,000.

---

**Ghi nhớ**

- Đây là **bài học nền tảng**, giúp người học định hình tư duy về việc dùng ML cho các bài toán bảo mật.
    
- Không cần hiểu hết mọi công cụ ngay lập tức. Quan trọng là nắm được **bức tranh tổng thể**: ML là gì, tại sao nó cần thiết, và ta sẽ học gì trong khóa học này.


---


### **2. Vì sao cần Machine Learning trong An ninh mạng?**

**Tóm tắt nội dung**

Trong phần này, thầy Ricardo giải thích lý do tại sao **học máy (machine learning)** lại trở thành một **công cụ thiết yếu** trong việc giải quyết các thách thức an ninh mạng ngày nay. Lý do chính: **con người không thể xử lý hết dữ liệu** và **các cuộc tấn công ngày càng tinh vi, đa dạng**.

---

#### **2.1. Khối lượng dữ liệu khổng lồ**

Trong môi trường số hiện đại, mỗi ngày có **hàng triệu log, cảnh báo, kết nối mạng** được tạo ra bởi các thiết bị, ứng dụng, và hệ thống bảo mật. Việc **phân tích thủ công gần như là bất khả thi**.

Ví dụ:

- Một tổ chức trung bình có thể thu thập **hơn 10 triệu sự kiện log mỗi ngày** từ các hệ thống bảo mật như firewall, IDS/IPS, endpoint, v.v.
    
- Nếu mỗi chuyên viên SOC đọc 1 log mỗi giây thì cũng cần hơn **115 ngày để xem hết 10 triệu log!**

---

#### **2.2. Việc xây dựng mô hình bằng tay là quá phức tạp**

- Viết quy tắc phát hiện (rule-based detection) thủ công như: “Nếu IP nằm trong blacklist thì cảnh báo” có thể áp dụng cho một số trường hợp đơn giản.
    
- Tuy nhiên, **kẻ tấn công ngày càng khôn ngoan**, họ thay đổi phương pháp, IP, cách thức – dẫn đến **mô hình thủ công lỗi thời nhanh chóng**.

ML có thể **học từ dữ liệu quá khứ**, nhận diện **mẫu hành vi nguy hiểm** ngay cả khi chưa từng xuất hiện trước đó (zero-day behavior).

---

#### **2.3. Machine Learning có thể tự học mô hình**

Thay vì lập trình cụ thể “nếu… thì…”, ML sử dụng dữ liệu huấn luyện để **tự tìm ra mối quan hệ ẩn** giữa các biến (features) và kết quả (như “bị tấn công” hay “bình thường”).

Ví dụ: Nếu trong quá khứ, mỗi khi có:

- Lượng traffic tăng đột biến
    
- Gửi nhiều request đến 1 domain trong thời gian ngắn
    
- Cùng 1 User Agent truy cập nhiều địa chỉ

→ Thì thường dẫn đến hành vi tấn công DDoS → ML có thể học được mô hình này để cảnh báo sớm.

---

#### **2.4. Tăng tốc độ và độ chính xác trong phát hiện**

- ML giúp **giảm thời gian phát hiện** từ hàng giờ xuống còn vài phút hoặc thậm chí vài giây.
    
- Một số mô hình deep learning còn đạt độ chính xác **trên 95%** trong phân loại phần mềm độc hại.

---

#### **2.5. Khả năng thích ứng**

- Các mô hình ML có thể được **huấn luyện lại** khi dữ liệu thay đổi, cho phép chúng **thích nghi với mối đe dọa mới**.
    
- Điều này giúp hệ thống an ninh **linh hoạt và thông minh hơn theo thời gian**, không bị “già cỗi”.

---

**Ghi nhớ**

- Cybersecurity không còn là bài toán của riêng con người. Dữ liệu quá nhiều, tấn công quá nhanh, và rủi ro quá lớn.
    
- ML là công cụ để **giảm gánh nặng thủ công**, **phát hiện hành vi bất thường nhanh hơn**, và **phòng thủ chủ động hơn**.


---


### **3. Machine Learning là gì?**

**Tóm tắt nội dung**

Trong phần này, thầy Ricardo đi thẳng vào khái niệm **machine learning (học máy)** – không chỉ là một từ thời thượng, mà là **một tập hợp các phương pháp** giúp máy tính **tự động học từ dữ liệu**, từ đó đưa ra **dự đoán**, **phân loại**, hoặc **phát hiện** những mẫu (pattern) mà con người khó nhận ra.

---

#### **3.1. Định nghĩa dễ hiểu**

**Machine Learning (ML)** là tập hợp các phương pháp cho phép:

- Máy tính **học từ dữ liệu có sẵn**
    
- Sau đó **dự đoán hoặc phân loại** các dữ liệu mới chưa từng thấy
    
- Dựa trên một mô hình đã học (learned model)

Ví dụ: Nếu bạn cho máy “xem” hàng ngàn email được gắn nhãn là “spam” hoặc “không spam”, thì nó có thể học để tự động phát hiện spam trong tương lai.

---

#### **3.2. Cách hoạt động tổng quan**

Một mô hình ML cần 2 thành phần chính:

- **Dữ liệu (data)**: Đầu vào của hệ thống. Dữ liệu càng chất lượng thì mô hình học càng tốt.
    
- **Thuật toán học (learning algorithm)**: Cách máy “học” từ dữ liệu.

Một cách dễ hình dung:

> Mô hình ML giống như học sinh, dữ liệu là sách vở, còn thuật toán học là phương pháp học (ghi nhớ, rút gọn, tổng hợp…).

---

#### **3.3. Dự đoán, phân nhóm hay phát hiện?**

Các phương pháp ML được áp dụng cho nhiều nhiệm vụ:

- **Phân loại (classification)**: Dự đoán nhãn (label), ví dụ: “email này là spam hay không?”
    
- **Hồi quy (regression)**: Dự đoán giá trị liên tục, ví dụ: “nhiệt độ ngày mai là bao nhiêu?”
    
- **Phân nhóm (clustering)**: Gom các mẫu dữ liệu thành nhóm có đặc điểm tương đồng, ví dụ: “phân nhóm người dùng có hành vi lạ”.
    
- **Phát hiện bất thường (anomaly detection)**: Phát hiện hành vi không bình thường trong hệ thống mạng – rất quan trọng trong cybersecurity.

---

#### **3.4. Mô hình có thể là hình học**

Nhiều thuật toán ML dựa trên **hình học**, như:

- Khoảng cách giữa các điểm dữ liệu (distance metric)
    
- Các đường phân tách tuyến tính (linear boundaries)

Ví dụ: Giống như bạn vẽ một đường chia học sinh giỏi và học sinh khá trên biểu đồ điểm toán – đường này chính là mô hình.

---

#### **3.5. ML không phải là “magic”**

ML **không tự động hiểu dữ liệu** – bạn phải:

- Cung cấp dữ liệu đúng cách (tiền xử lý, chọn đặc trưng phù hợp)
    
- Đánh giá mô hình sau khi huấn luyện

Nó giống như dạy học sinh học: bạn phải **soạn giáo án tốt**, **kiểm tra đánh giá đúng**, và **chỉnh sửa nếu học sinh học sai**.

---

**Ghi nhớ**

- ML là quá trình **học từ dữ liệu**, không phải lập trình ra các quy tắc thủ công.
    
- Mục tiêu là **tạo ra mô hình có thể dự đoán đúng trong tương lai**.
    
- Hiểu được bản chất của mô hình là hình học (distance, boundaries) giúp bạn dễ hình dung hơn về cách máy hoạt động.


---


### **4. Big Data là gì và tại sao nó quan trọng?**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo giải thích về khái niệm **Big Data (dữ liệu lớn)** – một trong những lý do chính khiến việc sử dụng Machine Learning trở nên **bắt buộc** trong lĩnh vực an ninh mạng (và nhiều lĩnh vực khác). Bởi vì khi dữ liệu quá nhiều, con người không thể xử lý nổi, chỉ có máy móc mới làm nổi.

---

#### **4.1. Big Data là gì?**

**Big Data** là khối lượng dữ liệu quá lớn đến mức:

- Không thể xử lý trên một máy tính bình thường (VD: 8GB RAM, CPU đời mới).
    
- Không thể mở Excel ra xem từng dòng một như trước nữa.
    
- Phải dùng **các công cụ đặc biệt**, **máy tính mạnh hơn** hoặc **nhiều máy chạy song song**.

Ví dụ: Một công ty tài chính mỗi ngày có thể sinh ra **hàng terabyte (TB)** log giao dịch – đây là Big Data.

---

#### **4.2. Tại sao Big Data lại phổ biến trong cybersecurity?**

- Mỗi thiết bị mạng, firewall, máy chủ, người dùng… đều tạo ra log.
    
- Mỗi sự kiện truy cập, gửi mail, tải file, kết nối đến IP lạ… đều được ghi lại.
    
- Tấn công mạng (như APT, ransomware) có thể tạo ra hàng ngàn sự kiện nhỏ trong vài phút.

→ Tất cả tạo nên một **lượng dữ liệu khổng lồ**, phức tạp, và đa dạng.

---

#### **4.3. Cần gì để xử lý Big Data?**

Muốn xử lý được Big Data, ta cần:

**Cách 1: Máy tính mạnh hơn**

- Dùng **GPU (Graphics Processing Unit)**: xử lý tính toán song song, rất nhanh.
    
- Dùng **CPU đa lõi (multi-core)**: nhiều lõi chạy cùng lúc.
    
- Một số còn dùng **TPU (Tensor Processing Unit)** – chip chuyên cho AI.

**Cách 2: Dùng nhiều máy tính chạy song song (distributed computing)**

- Sử dụng công cụ như **Hadoop** hay **Apache Spark**.
    
- Dữ liệu được chia nhỏ và xử lý cùng lúc trên nhiều máy tính (giống như chia bài cho nhiều người cùng chơi).

---

#### **4.4. ML và Big Data: “Cặp đôi hoàn hảo”**

- **Machine Learning cần dữ liệu** để học → Big Data cung cấp dữ liệu dồi dào.
    
- **Big Data quá lớn để phân tích thủ công** → ML giúp phân tích tự động, nhanh chóng, chính xác.

Nói cách khác, Big Data là “nhiên liệu”, còn ML là “động cơ” để khai thác sức mạnh của dữ liệu.

---

#### **4.5. Ứng dụng thực tế**

- **Phát hiện xâm nhập mạng (Intrusion Detection)**: Phân tích hàng triệu log để phát hiện hành vi tấn công.
    
- **Phân tích hành vi người dùng (UBA)**: Theo dõi hành vi bất thường của user trong hệ thống lớn.
    
- **Phân loại email**: Dùng ML để phân tích hàng triệu email và phát hiện lừa đảo (phishing).

---

**Ghi nhớ**

- Big Data là **thực tế tất yếu** trong kỷ nguyên số, đặc biệt ở các tổ chức lớn.
    
- Bạn không thể “đọc” từng dòng log bằng mắt – phải dùng công cụ, phải dùng ML.
    
- ML không chỉ “chịu đựng” được Big Data – mà còn **phát huy sức mạnh nhất khi có nhiều dữ liệu**.


---


### **5. Các thuật ngữ căn bản trong Machine Learning**

**Tóm tắt nội dung**

Phần này giải thích các **khái niệm cốt lõi** mà bất kỳ ai học ML đều phải nắm rõ: supervised learning (học có giám sát), unsupervised learning (học không giám sát), features (đặc trưng), datasets (tập dữ liệu), và cách đánh giá mô hình (evaluation). Đây là nền tảng để bạn hiểu rõ các mô hình hoạt động ra sao.

---

#### **5.1. Supervised Learning (Học có giám sát)**

**Khái niệm**

- Dữ liệu có **nhãn (label)** đi kèm.
    
- Mô hình học cách **liên kết đặc trưng (features)** với nhãn đầu ra.
    
- Giống như bạn dạy học sinh bằng cách **cho bài tập có đáp án**.

**Quy trình**

![[Pasted image 20250729102856.png]]

1. Chia dữ liệu thành 2 phần:
    
    - **Train Data (dữ liệu huấn luyện)**: để mô hình học.
        
    - **Test Data (dữ liệu kiểm tra)**: để đánh giá mô hình.
        
    
2. Dùng thuật toán → tạo ra **classifier (bộ phân loại)**.
    
3. Đưa X_test vào mô hình → so sánh kết quả Y_test dự đoán với nhãn thật.

**Ví dụ**

- Dự đoán email là “spam” hay “ham” (thư thường).
    
- Phân loại địa chỉ IP là “bình thường” hay “nguy hiểm”.

---

#### **5.2. Unsupervised Learning (Học không giám sát)**

**Khái niệm**

- Dữ liệu **không có nhãn**.
    
- Mô hình cố gắng **tìm ra cấu trúc ẩn hoặc phân nhóm (clusters)** bên trong dữ liệu.

**Quy trình**

![[Pasted image 20250729102936.png]]

1. Thu thập dữ liệu.
    
2. Áp dụng thuật toán **clustering (gom cụm)** như K-means.
    
3. Xem kết quả phân nhóm có ý nghĩa gì không.

**Ví dụ**

- Phân nhóm người dùng theo hành vi truy cập web.
    
- Phát hiện **hành vi bất thường** trong log hệ thống – thường dùng trong an ninh mạng khi chưa biết mẫu tấn công.

---

#### **5.3. Các thuật ngữ quan trọng khác**

**Feature (Đặc trưng)**

- Là những thông tin mô tả mẫu dữ liệu.
    
- Ví dụ: Trong email, các feature có thể là: số từ “free”, có đính kèm file không, ngôn ngữ sử dụng, v.v.

**Dataset (Tập dữ liệu)**

- Là tập hợp nhiều mẫu dữ liệu để huấn luyện mô hình.
    
- Gồm cả dữ liệu đầu vào (features) và đầu ra (labels – nếu là supervised).

**Pre-processing (Tiền xử lý dữ liệu)**

- Là bước làm sạch, định dạng lại dữ liệu để mô hình học tốt hơn.
    
- Ví dụ: chuẩn hóa số liệu, chuyển text thành số, loại bỏ dữ liệu thiếu.
  
**Performance metrics (Chỉ số đánh giá mô hình)**

Một số chỉ số phổ biến:

- **Accuracy (Độ chính xác)**: bao nhiêu % mẫu dự đoán đúng.
    
- **Precision / Recall / F1-score**: dùng khi dữ liệu mất cân bằng (VD: tấn công mạng rất hiếm, nên cần đo đúng loại).
    
- **Confusion Matrix**: ma trận phân tích đúng/sai giữa các lớp dự đoán và thực tế.

---

**So sánh nhanh: Supervised vs Unsupervised**

|**Đặc điểm**|**Supervised Learning**|**Unsupervised Learning**|
|---|---|---|
|Có nhãn dữ liệu?|Có|Không|
|Bài toán điển hình|Phân loại (classification)|Gom nhóm (clustering)|
|Mục tiêu|Dự đoán nhãn cho dữ liệu mới|Tìm cấu trúc ẩn trong dữ liệu|
|Ví dụ ứng dụng|Phát hiện spam, phân loại IP|Phân cụm hành vi truy cập bất thường|

---

**Ghi nhớ**

- **Supervised**: có đáp án → dạy máy dự đoán.
    
- **Unsupervised**: không có đáp án → để máy tự “nhìn hình đoán chữ”.
    
- Feature và pre-processing **cực kỳ quan trọng** – như chọn nguyên liệu ngon trước khi nấu ăn.
    
- Đánh giá mô hình không chỉ dựa vào accuracy – phải chọn đúng **chỉ số phù hợp với bài toán**.


---


### **6. Các thuật toán phổ biến trong Machine Learning**

**Tóm tắt nội dung**

Phần này giới thiệu những **thuật toán cốt lõi** được dùng rộng rãi trong cả nghiên cứu và ứng dụng thực tế – từ các bài toán đơn giản như phân loại email, đến các bài toán phức tạp như phát hiện mã độc, dự đoán hành vi tấn công mạng.

---

#### **6.1. Naive Bayes**

- Dựa trên định lý Bayes và **giả định độc lập giữa các đặc trưng**.
    
- Rất nhanh và hiệu quả trong các bài toán phân loại văn bản (text classification).

**Ví dụ**: Phân loại email là spam/ham dựa trên tần suất từ như “free”, “click”, “money”.

✅ **Ưu điểm**: Tốc độ nhanh, ít tài nguyên.
❌ **Nhược điểm**: Giả định đơn giản (các feature không phụ thuộc lẫn nhau).

---

#### **6.2. Decision Trees (Cây quyết định)**

- Mô hình cây: chia nhỏ dữ liệu theo các điều kiện “nếu – thì” để đi đến quyết định.
    
- Dễ hiểu và giải thích.

**Ví dụ**: Nếu IP nằm trong blacklist → kiểm tra cổng kết nối → nếu đúng port bất thường → cảnh báo.

✅ **Ưu điểm**: Dễ trực quan, giải thích được.
❌ **Nhược điểm**: Dễ overfit (học quá kỹ dữ liệu train).

---

#### **6.3. Random Forest**

- Là tập hợp nhiều cây quyết định → bỏ phiếu để ra kết quả.
    
- Giảm nguy cơ overfitting và tăng độ chính xác.

✅ **Ưu điểm**: Mạnh hơn Decision Tree, hoạt động tốt với dữ liệu nhiều chiều.

---

#### **6.4. K-Nearest Neighbors (KNN)**

- Khi gặp dữ liệu mới, mô hình **so sánh khoảng cách** đến K điểm gần nhất trong dữ liệu huấn luyện → lấy đa số để quyết định.

**Ví dụ**: IP A có hành vi tương tự 3 IP đã bị đánh giá là tấn công → dự đoán IP A cũng nguy hiểm.

✅ **Ưu điểm**: Đơn giản, không cần huấn luyện trước.
❌ **Nhược điểm**: Tốn thời gian tính khoảng cách, không hiệu quả với dữ liệu lớn.

---

#### **6.5. Linear Regression (Hồi quy tuyến tính)**

- Dùng để dự đoán **giá trị số** bằng cách học một đường thẳng phù hợp với dữ liệu.

**Ví dụ**: Dự đoán số lượng kết nối mạng bất thường dựa trên thời gian trong ngày.

---

#### **6.6. Logistic Regression**

- Dùng cho **phân loại nhị phân**, dù tên có “regression”.
    
- Dự đoán xác suất thuộc một nhãn (VD: 0 hoặc 1).

**Ví dụ**: Xác suất một request là tấn công hay không.

---

#### **6.7. Neural Networks (Mạng nơ-ron)**

- Mô hình mô phỏng cách hoạt động của não người, gồm nhiều lớp xử lý.
    
- Mỗi lớp học một biểu diễn trừu tượng hơn của dữ liệu.

**Ứng dụng**: Phát hiện mã độc, nhận diện hình ảnh, xử lý ngôn ngữ.

✅ **Ưu điểm**: Khả năng học dữ liệu phức tạp.
❌ **Nhược điểm**: Cần dữ liệu lớn, tốn tài nguyên tính toán.

---

#### **6.8. Support Vector Machines (SVM)**

- Tìm ra đường biên phân tách tối ưu giữa các lớp.
    
- Có thể dùng kernel để phân lớp phi tuyến tính.

✅ **Ưu điểm**: Hiệu quả với dữ liệu nhiều chiều, rõ ràng.

---

**Ghi nhớ**

- Mỗi thuật toán có **ưu – nhược điểm riêng**, không có mô hình “thần thánh”.
    
- Quan trọng là hiểu **dữ liệu của bạn thuộc dạng gì** (nhiễu, nhiều chiều, mất cân bằng?) để chọn mô hình phù hợp.
    
- Trong thực tế, thường phải **thử nhiều mô hình**, **đánh giá bằng số liệu**, rồi mới chọn cái tốt nhất.


---


### **7. Deep Learning là gì? Khác gì với Machine Learning?**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo giải thích **Deep Learning (học sâu)** chính là một nhánh con của Machine Learning, nhưng mạnh mẽ hơn nhiều nhờ khả năng học **tự động từ dữ liệu lớn** và **không cần đặc trưng thủ công**. Đây là công nghệ đứng sau các ứng dụng “AI hiện đại” như nhận diện khuôn mặt, dịch ngôn ngữ, ChatGPT…

---

#### **7.1. Deep Learning là gì?**

- Là **một loại đặc biệt của mạng nơ-ron nhân tạo (Neural Network)**, nhưng có **nhiều lớp ẩn (hidden layers)** giữa đầu vào và đầu ra.
    
- Càng nhiều lớp → càng “deep” → học được các biểu diễn phức tạp hơn.

Ví dụ đơn giản:

- ML: cần kỹ sư viết feature “tên miền lạ” → mô hình mới phát hiện tấn công.
    
- DL: tự học ra đặc trưng như “domain có pattern đáng ngờ” mà không cần con người thiết kế.

---

#### **7.2. Sự khác biệt giữa Machine Learning và Deep Learning**

|**Tiêu chí**|**Machine Learning**|**Deep Learning**|
|---|---|---|
|Cần tạo feature thủ công|Có|Không (tự học từ dữ liệu thô)|
|Dữ liệu cần thiết|Có thể học với tập nhỏ|Cần tập dữ liệu rất lớn|
|Tài nguyên xử lý|Có thể chạy bằng CPU thông thường|Cần GPU mạnh để huấn luyện|
|Giải thích mô hình|Dễ hiểu, dễ giải thích|Khó hiểu, “hộp đen”|
|Ứng dụng tiêu biểu|Spam filter, dự đoán giá, phân loại đơn giản|Nhận diện khuôn mặt, dịch tự động, chatbot AI|

---

#### **7.3. Vì sao Deep Learning bùng nổ từ 2012?**

- **Sức mạnh GPU**: giúp xử lý nhanh hàng triệu phép nhân ma trận.
    
- **Big Data**: có nhiều dữ liệu hơn để huấn luyện mô hình phức tạp.
    
- **Thuật toán tối ưu**: như backpropagation, ReLU, dropout… được cải thiện.
    
- **Kết quả vượt trội**: Trong nhiều bài toán như nhận dạng ảnh, dịch ngôn ngữ, Deep Learning **đánh bại tất cả mô hình ML truyền thống**.

---

#### **7.4. Cách Deep Learning hoạt động**

- Input (dữ liệu thô) → đi qua nhiều lớp tính toán → càng vào sâu, càng trừu tượng.
    
- Ở lớp đầu: học cạnh, màu (trong ảnh).
    
- Ở lớp giữa: học hình dạng, cấu trúc.
    
- Ở lớp cuối: học concept như “mặt người”, “hành vi tấn công”.

---

#### **7.5. Deep Learning và Cybersecurity**

Deep Learning đã được áp dụng hiệu quả vào nhiều bài toán an ninh mạng:

- **Phân loại phần mềm độc hại (malware classification)**: dùng DL để phân tích binary như ảnh.
    
- **Phát hiện hành vi bất thường** trong hệ thống mạng.
    
- **Nhận diện ngôn ngữ độc hại** trong log hoặc email phishing.

---

**Ghi nhớ**

- Deep Learning không thay thế Machine Learning, mà **mở rộng và nâng cấp khả năng học từ dữ liệu lớn**.
    
- Khi nào dùng DL?
    
    - Khi có **nhiều dữ liệu**.
        
    - Khi bài toán **phức tạp hoặc phi cấu trúc** (ảnh, chuỗi, ngôn ngữ…).
        
    
- DL mạnh nhưng **tốn tài nguyên**, cần hiểu rõ **điều kiện áp dụng** để không lãng phí.


---


### **8. Pipeline (Quy trình) Machine Learning điển hình**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo trình bày quy trình chung để xây dựng một mô hình machine learning. Đây là **“xương sống”** của bất kỳ dự án học máy nào – dù bạn làm phát hiện xâm nhập mạng, phân loại email, hay dự đoán hành vi tấn công.

---

#### **8.1. Các bước trong pipeline ML**

**Bước 1: Thu thập dữ liệu (Data Collection)**

- Dữ liệu có thể từ nhiều nguồn:
    
    - Log hệ thống
        
    - Tập tin .csv, .arff, .libsvm
        
    - Dữ liệu từ IDS, firewall, honeypot, endpoint, cloud…  

> Ví dụ: Tập dữ liệu NSL-KDD dùng để huấn luyện mô hình phát hiện xâm nhập mạng.

---

**Bước 2: Tiền xử lý dữ liệu (Pre-processing)**

- Là bước **làm sạch và chuẩn bị dữ liệu** để đưa vào mô hình:
    
    - Xử lý thiếu dữ liệu (missing values)
        
    - Mã hóa dữ liệu dạng text (VD: tcp/udp → số)
        
    - Chuẩn hóa hoặc scale giá trị (min-max, z-score…)

> Dữ liệu chưa xử lý giống như nguyên liệu chưa sơ chế – rất khó “nấu ăn” đúng.

---

**Bước 3: Vector Space Model (Biểu diễn dữ liệu thành vector)**

- Mọi dữ liệu (text, hình ảnh, network flow…) đều phải **chuyển thành dạng số** (vector) thì mô hình mới hiểu được.
    
- Ví dụ:
    
    - Với text → dùng Bag-of-Words hoặc TF-IDF
        
    - Với ảnh → ma trận pixel
        
    - Với dữ liệu mạng → các chỉ số như duration, protocol, byte in/out…

> Bước này giúp dữ liệu có dạng **đồng nhất và có thể tính toán được**.

---

**Bước 4: Áp dụng thuật toán học máy (Apply ML Algorithm)**

- Chọn một mô hình phù hợp: Naive Bayes, KNN, Decision Tree, Neural Network…
    
- Chia dữ liệu thành tập train/test
    
- Huấn luyện mô hình trên tập train

> Trong bảo mật, có thể dùng Random Forest để phân loại packet, hoặc dùng Deep Learning để phát hiện hành vi tấn công dựa trên log chuỗi.

---

**Bước 5: Đánh giá mô hình (Evaluation)**

- Dùng tập test để kiểm tra độ chính xác:
    
    - Accuracy
        
    - Precision / Recall / F1-score
        
    - Confusion Matrix
        
    
- Tùy bài toán mà chọn chỉ số phù hợp. Ví dụ:
    
    - Với tấn công mạng (thường rất hiếm): **Precision và Recall quan trọng hơn Accuracy**

---

#### **8.2. Mối liên kết giữa các bước**

- Từng bước **liên kết chặt chẽ với nhau**:
    
    - Dữ liệu đầu vào chất lượng → pre-processing dễ dàng hơn.
        
    - Feature tốt → mô hình học hiệu quả hơn.
        
    - Đánh giá đúng → chọn được mô hình phù hợp nhất.

> Nếu 1 bước làm sai, cả pipeline có thể “sập đổ”.

---

**Ghi nhớ**

- Pipeline ML gồm 5 bước: **Dữ liệu → Tiền xử lý → Vector hóa → Huấn luyện mô hình → Đánh giá**.
    
- Đây là **quy trình tiêu chuẩn**, được dùng trong mọi ứng dụng từ AI đến cybersecurity.
    
- Làm tốt pipeline giúp bạn **hiểu rõ toàn bộ vòng đời của một mô hình ML thực thụ** – không chỉ “chạy code cho xong”.


---


### **9. Định dạng dữ liệu và ví dụ thực tế**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo giới thiệu các **định dạng dữ liệu phổ biến** trong Machine Learning, đặc biệt là trong lĩnh vực an ninh mạng, cũng như **ví dụ cụ thể** về cách dữ liệu được trình bày để đưa vào mô hình học máy.

---

#### **9.1. Vì sao định dạng dữ liệu lại quan trọng?**

- Mọi mô hình học máy đều cần **đầu vào là dữ liệu dạng số**.
    
- Định dạng dữ liệu quyết định cách bạn xử lý, đọc, và huấn luyện mô hình.
    
- Một số công cụ ML như **WEKA**, **scikit-learn**, **libsvm** chỉ chấp nhận định dạng nhất định.

---

#### **9.2. Các định dạng dữ liệu phổ biến**

**1. CSV (.csv – Comma-Separated Values)**

- Cấu trúc đơn giản, dễ đọc.
    
- Mỗi dòng là một mẫu dữ liệu.
    
- Các giá trị cách nhau bằng dấu phẩy.

**Ví dụ:**

```
0,tcp,http,SF,162,4528,0,0,0,1,...,normal
```

Ở đây:

- 0: duration
    
- tcp: protocol type
    
- http: service
    
- normal: label (bình thường)

✅ **Ưu điểm**: dễ xem bằng Excel, đọc bằng Python (pandas).
❌ **Nhược điểm**: không có thông tin định dạng (kiểu dữ liệu).

---

**2. LibSVM format (.libsvm)**

- Dùng phổ biến trong các công cụ như SVM hoặc XGBoost.
    
- Dữ liệu được biểu diễn dạng: [label] [index]:[value] ...

**Ví dụ:**

```
1 1:0.53 3:0.27 6:0.94 ...
```

→ Dễ dàng cho máy tính đọc nhanh các feature sparse (thưa).

✅ **Ưu điểm**: tối ưu cho dữ liệu có nhiều đặc trưng, dùng trong big data.
❌ **Nhược điểm**: khó đọc bằng mắt người.

---

**3. ARFF (.arff – Attribute Relation File Format)**

- Định dạng đặc trưng của **WEKA**.
- Có 2 phần: phần khai báo thuộc tính + phần dữ liệu.

**Ví dụ:**

```
@attribute duration numeric
@attribute protocol_type {tcp, udp, icmp}
@data
0,tcp,http,SF,162,4528,0,0,0,1,...,normal
```

✅ **Ưu điểm**: có thông tin kiểu dữ liệu rõ ràng.
❌ **Nhược điểm**: không phổ biến ngoài WEKA.

---

#### **9.3. Thế nào là một “sample” trong dữ liệu?**

**Sample (mẫu dữ liệu)**: là **đơn vị nhỏ nhất** mà mô hình học từ đó. Mỗi sample có thể là:

- Một dòng log mạng.
    
- Một email.
    
- Một ảnh chụp dấu vân tay.
    
- Trung bình giá trị trong 10 giây của hệ thống mạng.

> **Xác định rõ sample là gì là bước rất quan trọng** – vì nó ảnh hưởng trực tiếp đến việc trích xuất đặc trưng và huấn luyện mô hình.

---

#### **9.4. Ví dụ thực tế trong cybersecurity**

**Ví dụ 1: Email phishing**

- Mỗi sample là 1 email.
    
- Các feature: số từ khóa nghi ngờ, có file đính kèm không, đường link lạ…
    
- Label: phishing / không phishing.

**Ví dụ 2: Network traffic**

- Mỗi sample là 1 phiên kết nối (flow).
    
- Feature: thời lượng kết nối, byte gửi đi, loại protocol.
    
- Label: normal / attack

---

**Ghi nhớ**

- Định dạng dữ liệu ảnh hưởng đến việc đọc, xử lý và huấn luyện mô hình.
    
- Biết cách **chuyển đổi giữa các định dạng phổ biến** sẽ giúp bạn làm việc dễ hơn với nhiều công cụ.
    
- Hiểu rõ **sample là gì** là tiền đề quan trọng trước khi bắt đầu tiền xử lý hay trích xuất đặc trưng.


---


### **10. Một số bộ dữ liệu dùng trong an ninh mạng**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo giới thiệu một số **bộ dữ liệu tiêu chuẩn** mà các nhà nghiên cứu và kỹ sư an ninh mạng thường sử dụng để xây dựng và đánh giá các mô hình ML/DL. Những bộ dữ liệu này thường mô phỏng các cuộc tấn công mạng hoặc hành vi bất thường – rất quan trọng trong việc dạy máy “phân biệt giữa bình thường và nguy hiểm”.

---

#### **10.1. Vai trò của bộ dữ liệu trong cybersecurity**

- Là **nguồn “thực phẩm” đầu vào** cho mô hình học máy.
    
- Phải đủ:
    
    - **Lớn**: nhiều mẫu dữ liệu
        
    - **Đa dạng**: có nhiều loại tấn công khác nhau
        
    - **Cân bằng**: tránh quá lệch giữa nhãn “bình thường” và “tấn công”
        
    
- Một bộ dữ liệu tốt giúp:
    
    - Tăng độ chính xác phát hiện tấn công
        
    - Huấn luyện mô hình thực tế, dễ triển khai

---

#### **10.2. Một số bộ dữ liệu phổ biến**

**1. NSL-KDD**

- Phiên bản nâng cấp của bộ KDD Cup 1999.
    
- Bao gồm nhiều loại tấn công như:
    
    - DoS (Tấn công từ chối dịch vụ)
        
    - Probe (do thám)
        
    - U2R (user-to-root)
        
    - R2L (remote-to-local)
        
    
- Có định dạng .csv, dễ xử lý.

✅ **Ưu điểm**: Phổ biến, dễ tải về, dùng để học và benchmark.
❌ **Nhược điểm**: Dữ liệu cũ, ít phản ánh thực tế hiện tại.

---

**2. UNSW-NB15**

- Do UNSW Canberra tạo ra vào năm 2015.
    
- Mô phỏng hệ thống mạng thực tế, sinh ra log bằng công cụ IXIA PerfectStorm.
    
- Có nhiều loại tấn công hiện đại hơn như:
    
    - Fuzzers, Backdoors, Worms, Exploits…

✅ **Ưu điểm**: Dữ liệu thực tế, chất lượng cao, phù hợp bài toán hiện đại.

---

**3. Phishing Datasets**

- Các tập email đã được phân loại là phishing / legit.
    
- Dùng trong các bài toán như:
    
    - Phát hiện email lừa đảo
        
    - Phân tích URL độc hại

> Một số tập như PhishTank, UCI Phishing Websites Data, v.v.

---

**4. Honeypot datasets**

- Log từ các máy chủ “mồi” (honeypot) đặt ra để thu thập hành vi tấn công.
    
- Có thể bao gồm:
    
    - IP nguồn tấn công
        
    - Câu lệnh tấn công
        
    - Thời gian thực hiện

✅ **Rất hữu ích** để huấn luyện mô hình phát hiện tấn công thực tế.

---

**5. Botnet / Malware traffic**

- Tập log từ hệ thống bị nhiễm malware, botnet.
    
- Mô hình học có thể:
    
    - Nhận diện command & control traffic
        
    - Phân biệt giữa traffic thật và giả

---

**6. Biometric datasets**

- Dùng trong bài toán xác thực người dùng:
    
    - Dấu vân tay
        
    - Hành vi gõ phím
        
    - Nhận diện khuôn mặt

→ Gắn liền với **authentication** trong bảo mật cá nhân.

---

#### **10.3. Lưu ý khi chọn bộ dữ liệu**

- **Hiểu rõ mục tiêu bài toán**: phát hiện tấn công mạng? phishing? phân loại phần mềm độc hại?
    
- **Kiểm tra cấu trúc dữ liệu**: có nhãn không? định dạng gì? dữ liệu có bị mất không?
    
- **Tìm hiểu nguồn**: dữ liệu từ đâu? có công khai không? có cần xử lý thêm không?

---

**Ghi nhớ**

- Không có mô hình nào mạnh nếu **thiếu dữ liệu huấn luyện chất lượng**.
    
- Bắt đầu với **NSL-KDD** hoặc **UNSW-NB15** nếu bạn muốn luyện bài toán phát hiện tấn công mạng.
    
- Luôn kiểm tra kỹ **định dạng, chất lượng, và độ cập nhật của bộ dữ liệu** trước khi dùng để train mô hình.


---


### **11. Doanh nghiệp nào đang áp dụng Machine Learning và trong lĩnh vực nào?**

**Tóm tắt nội dung**

Phần này thầy Ricardo liệt kê các **tập đoàn công nghệ lớn và các công ty an ninh mạng** đã tích cực áp dụng Machine Learning vào sản phẩm và dịch vụ của họ. Bạn sẽ thấy ML không còn là “xu hướng tương lai” nữa – **nó đang ở khắp nơi trong hiện tại.**

---

#### **11.1. Các công ty công nghệ hàng đầu sử dụng ML**

**1. Google**

- Dùng ML để:
    
    - **Gợi ý tìm kiếm thông minh**
        
    - Phân loại **spam trong Gmail**
        
    - Dịch ngôn ngữ (Google Translate)
        
    - Phát hiện và lọc nội dung vi phạm trên YouTube

**2. Facebook**

- Áp dụng ML để:
    
    - **Phát hiện nội dung độc hại hoặc giả mạo**
        
    - Nhận diện khuôn mặt trong ảnh
        
    - Tối ưu hóa quảng cáo nhắm mục tiêu người dùng  

**3. Amazon**

- ML dùng trong:
    
    - **Alexa (trợ lý giọng nói)** – hiểu ngôn ngữ và phản hồi người dùng
        
    - Dự đoán nhu cầu đặt hàng
        
    - Phân tích hành vi khách hàng  

**4. Apple**

- Ứng dụng ML vào:
    
    - **Face ID**
        
    - Siri
        
    - Gợi ý ứng dụng / hành động dựa trên thói quen người dùng

**5. Microsoft**

- Cung cấp nền tảng ML trong:
    
    - **Azure Machine Learning**
        
    - Office 365 (sửa lỗi chính tả thông minh, gợi ý viết mail)


---


#### **11.2. Các công ty chuyên về an ninh mạng sử dụng ML**

**1. Northrop Grumman**

- Công ty quốc phòng Mỹ, áp dụng ML vào:
    
    - Phát hiện tấn công mạng
        
    - Phân tích hành vi thù địch trong thời gian thực


**2. BluVector**

- Sản phẩm sử dụng ML để:
    
    - **Phát hiện mã độc zero-day**
        
    - Nhận diện hành vi bất thường trong mạng doanh nghiệp


**3. Các ngân hàng và tổ chức tài chính**

- Ứng dụng ML để:
    
    - **Phát hiện giao dịch gian lận (fraud detection)**
        
    - Phân tích hành vi người dùng để phát hiện truy cập trái phép

> ML giúp các tổ chức này xử lý **hàng triệu giao dịch mỗi ngày**, phát hiện bất thường gần như **ngay lập tức**.

---

#### **11.3. Vai trò của ML trong các lĩnh vực khác**

|**Lĩnh vực**|**Ứng dụng ML nổi bật**|
|---|---|
|**Thương mại điện tử**|Gợi ý sản phẩm, phân tích hành vi khách hàng|
|**Y tế**|Dự đoán bệnh, phân tích hình ảnh y tế, thuốc cá nhân hóa|
|**Giao thông**|Xe tự lái (Tesla), tối ưu hóa tuyến đường|
|**Tài chính**|Dự đoán thị trường, phân tích rủi ro|
|**Giáo dục**|Gợi ý lộ trình học tập cá nhân hóa, phân tích kết quả học|

---

**Ghi nhớ**

- ML không còn là công nghệ “viễn tưởng”, mà đã **ăn sâu vào hoạt động của các ông lớn công nghệ** và cả **doanh nghiệp truyền thống**.
    
- Trong an ninh mạng, ML giúp **phát hiện tấn công nhanh hơn, chính xác hơn và mở rộng quy mô** bảo vệ dễ dàng hơn.
    
- **Nếu bạn học ML hôm nay**, bạn đang đi đúng hướng để bắt kịp tương lai công nghệ đang diễn ra ngay bây giờ.


---


### **12. Môi trường lập trình: Nền tảng, công cụ, phần cứng cần thiết**

**Tóm tắt nội dung**

Ở phần này, thầy Ricardo hướng dẫn chúng ta nên sử dụng **những công cụ, thư viện và phần cứng nào** để thực hành ML hiệu quả. Dù bạn dùng **máy ảo, máy thật, hay cloud**, phần này sẽ giúp bạn lựa chọn đúng công cụ để bắt đầu.

---

#### **12.1. Môi trường phần mềm (Software Environment)**

**1. Hệ điều hành**

- Nên dùng **Linux**, cụ thể:
    
    - **Ubuntu 14.04 – 16.04 (64-bit)**: tương thích tốt với nhiều công cụ ML.
    
- Hoặc có thể dùng **macOS** nếu bạn đang dùng máy Mac.

**2. Công cụ lập trình**

- **Python**: ngôn ngữ phổ biến nhất cho ML.
    
- Trình quản lý môi trường ảo: venv, conda.

**3. Các thư viện và framework ML**

- **NumPy**: xử lý mảng và tính toán số học.
    
- **Pandas**: phân tích dữ liệu dạng bảng (giống Excel).
    
- **Scikit-learn (Sklearn)**: thư viện học máy cổ điển, dễ dùng.
    
- **TensorFlow**: thư viện mạnh cho deep learning, đặc biệt khi xử lý dữ liệu lớn.
    
- **WEKA**: giao diện kéo-thả đơn giản, phù hợp cho người mới học, nhưng ít phổ biến hơn Python.

**4. Nền tảng đám mây**

- **AWS (Amazon Web Services)**: bạn có thể dùng máy ảo EC2 có GPU để huấn luyện mô hình nếu không có máy mạnh.

---

#### **12.2. Phần cứng khuyến nghị nếu bạn muốn tự build máy**

Nếu bạn muốn **tự xây dựng một dàn máy chuyên để học ML hoặc làm dự án thực tế**, thầy Ricardo gợi ý cấu hình như sau:

|**Bộ phận**|**Đề xuất tối thiểu**|
|---|---|
|**GPU (Card đồ họa)**|GeForce GTX 980 hoặc tốt hơn (GTX 1070, Titan)|
|**CPU**|AMD 8-core hoặc tương đương|
|**RAM**|Tối thiểu **32 GB** DDR3|
|**Ổ cứng**|SSD **1TB** để đọc ghi dữ liệu nhanh|
|**Nguồn**|EVGA SuperNOVA 1200 P2|
|**Mainboard (Bo mạch)**|Hỗ trợ đủ khe cắm cho GPU + CPU|
|**Vỏ case**|Loại rộng, thoáng khí|
|**Chi phí**|Khoảng **1,500 – 2,000 USD** cho cấu hình 1 CPU + 1 GPU|

> Đây là cấu hình hợp lý nếu bạn xác định học ML/DL lâu dài và làm các bài toán lớn.

---

#### **12.3. Máy ảo vs Máy thật vs Cloud**

|**Phương án**|**Ưu điểm**|**Nhược điểm**|
|---|---|---|
|**Máy ảo (VM)**|Dễ thiết lập, không ảnh hưởng hệ thống chính|Hiệu năng kém hơn máy thật|
|**Máy thật**|Hiệu năng cao, chủ động cài đặt|Chi phí phần cứng, bảo trì|
|**Cloud (AWS)**|Không cần máy mạnh, có thể thuê theo giờ|Tốn phí theo thời gian sử dụng|

---

**Ghi nhớ**

- Học ML không cần phải có **máy “khủng” ngay từ đầu**, nhưng nên biết hướng nâng cấp nếu cần.
    
- Dùng **Python + Sklearn/TensorFlow** là lựa chọn tối ưu để học và triển khai.
    
- Bạn có thể dùng **máy ảo để học lý thuyết và làm thử**, sau đó chuyển lên cloud nếu cần xử lý dữ liệu lớn.


---


### **13. Tổng kết và gợi ý thực hành**

**Tóm tắt nội dung**

Unit 1 là phần **mở đầu quan trọng**, giúp bạn xây nền vững chắc trước khi bước vào các bài học chuyên sâu. Ở phần này, thầy Ricardo tổng kết lại toàn bộ nội dung đã học và đưa ra một số hướng dẫn thực hành cơ bản để bạn **bắt đầu tự làm mô hình học máy trong an ninh mạng**.

---

#### **13.1. Tóm lược kiến thức đã học**

|**Chủ đề chính**|**Nội dung nổi bật**|
|---|---|
|**Giới thiệu ML cho Cybersecurity**|ML giúp xử lý dữ liệu lớn, tự học mô hình tấn công thay vì viết rule thủ công.|
|**Machine Learning là gì?**|Là quá trình học từ dữ liệu để dự đoán hoặc phân loại thông minh hơn.|
|**Big Data**|Lượng dữ liệu khổng lồ cần ML để phân tích hiệu quả và phát hiện tấn công.|
|**Supervised vs Unsupervised**|Phân biệt học có nhãn và học không nhãn, ứng dụng cụ thể trong an ninh mạng.|
|**Thuật toán học máy phổ biến**|Naive Bayes, KNN, Decision Tree, SVM, Neural Networks…|
|**Deep Learning**|Mạng nơ-ron nhiều lớp, tự học đặc trưng, mạnh trong bài toán phức tạp.|
|**Pipeline học máy**|Gồm: thu thập dữ liệu → tiền xử lý → vector hóa → mô hình → đánh giá.|
|**Định dạng dữ liệu & ví dụ thực tế**|.csv, .libsvm, .arff – cách lưu trữ và biểu diễn dữ liệu trong ML.|
|**Bộ dữ liệu Cyber phổ biến**|NSL-KDD, UNSW-NB15, Phishing, Honeypot…|
|**Doanh nghiệp ứng dụng ML**|Google, Amazon, Facebook, BluVector, ngân hàng…|
|**Môi trường thực hành**|Python, Sklearn, TensorFlow, Ubuntu, AWS, máy thật hoặc máy ảo.|

---

#### **13.2. Gợi ý thực hành cho người mới bắt đầu**

**✅ Bước 1: Cài môi trường cơ bản**

- Cài **Python 3.8+**
    
- Cài các thư viện cần thiết:
    
```
pip install numpy pandas scikit-learn matplotlib
```
- Tạo notebook (VD: Google Colab hoặc Jupyter)
    

**✅ Bước 2: Tải bộ dữ liệu NSL-KDD**

- Link: [https://www.unb.ca/cic/datasets/nsl.html](https://www.unb.ca/cic/datasets/nsl.html)
    
- Đọc dữ liệu bằng pandas và hiển thị 5 dòng đầu tiên

**✅ Bước 3: Chia dữ liệu thành train/test**

- Sử dụng train_test_split từ sklearn.model_selection

  
**✅ Bước 4: Thử huấn luyện mô hình đơn giản**

- Dùng **DecisionTreeClassifier** hoặc **RandomForest**
    
- Đánh giá bằng accuracy_score

**✅ Bước 5: Visualize kết quả**

- Vẽ biểu đồ confusion matrix
    
- So sánh accuracy giữa các thuật toán khác nhau

---

#### **13.3. Tài nguyên mở rộng**

- **GitHub của thầy Calix**: chứa tất cả mã nguồn mẫu cho khóa học ([**rcalix1**](https://github.com/rcalix1))
    
- Các tài liệu nên đọc:
    - “Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow”
    - “Machine Learning for Cybersecurity Cookbook”

---

**Ghi nhớ**

- Đây chỉ là **bước khởi đầu** – nhưng rất quan trọng. Nếu bạn nắm được kiến thức Unit 1, bạn đã sẵn sàng bước vào **thế giới thật** của Machine Learning cho cybersecurity.
- **Thực hành là chìa khóa**: hãy thử code, chỉnh sửa, thử sai và học từ dữ liệu thật.

