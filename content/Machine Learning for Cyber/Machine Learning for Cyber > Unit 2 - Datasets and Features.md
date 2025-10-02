
#cyber_security #machine_learning 

### **1. Giới thiệu và Mục tiêu học tập**

#### **1.1 Tóm tắt nội dung chính**

Phần mở đầu sẽ giúp ta hiểu rõ **tầm quan trọng của dữ liệu** và **features (đặc trưng)** trong các bài toán học máy (machine learning – ML), đặc biệt là khi ứng dụng vào lĩnh vực **an ninh mạng (cybersecurity)**. Mục tiêu của phần này là thiết lập nền tảng tư duy trước khi đi sâu vào chi tiết các thuật toán và quy trình xử lý.

---

#### **1.2 Mục tiêu học tập**

Kết thúc bài học này, bạn sẽ:
- **Hiểu rõ hơn về “feature”** là gì trong học máy.
- **Nắm được cách trích xuất (extract) feature** từ tập dữ liệu.
- Nhận biết sự khác biệt trong cách **xử lý dữ liệu cho ML thông thường** so với **ML trong cybersecurity**.

---

#### **1.3 Vì sao dữ liệu lại quan trọng đến vậy?**

Có một quan niệm rất thực tế trong giới ML:

**“Dữ liệu là vua – Data is king!”**

Một thuật toán tốt chỉ phát huy tác dụng khi có **dữ liệu chất lượng cao**. Ngược lại, một thuật toán yếu có thể vẫn hoạt động ổn nếu được “nuôi” bằng **dữ liệu đầy đủ, sạch và có ý nghĩa**.

**Ví dụ thực tế:**

- **Facebook, Google** là ví dụ điển hình của các công ty thành công nhờ **khối lượng dữ liệu khổng lồ** do chính người dùng tạo ra (qua like, comment, chia sẻ,…).
- Dù thuật toán của bạn chưa phải tốt nhất, nhưng nếu có **nhiều dữ liệu tốt**, bạn vẫn có thể đạt kết quả đáng kể.

---

#### **1.4 Cybersecurity và Machine Learning khác gì nhau?**

Một điều thú vị được nêu ra là:

> **“Điều khác biệt duy nhất giữa ML thông thường và ML trong cybersecurity chính là… dữ liệu.”**

- Các **thuật toán ML gần như không thay đổi**.    
- **Sự khác biệt nằm ở cách dữ liệu được biểu diễn**: chuyển đổi thành features, gán nhãn, chia mẫu,…
- Do đó, hiểu cách tổ chức dữ liệu **là bước đầu tiên và cực kỳ quan trọng** khi áp dụng ML cho các hệ thống phòng thủ mạng.

---

#### **1.5 Ghi nhớ**

- **Không có dữ liệu tốt**, thuật toán mạnh cũng trở nên vô dụng.
- **Cybersecurity ML = ML truyền thống + dữ liệu mạng đặc thù**.
- Cần học cách **chuyển dữ liệu thô (raw data)** thành **tập đặc trưng (feature set)** phù hợp cho thuật toán.


---


### **2. Tầm quan trọng của Dữ liệu trong Machine Learning**

#### **2.1 Tóm tắt nội dung chính**

Phần này đào sâu vào lý do tại sao **dữ liệu lại là yếu tố cốt lõi** trong mọi hệ thống học máy. Chúng ta sẽ phân tích vai trò của dữ liệu trong quá trình huấn luyện mô hình và học cách tư duy đúng về dữ liệu: **nhiều hơn, tốt hơn, và được gán nhãn đúng** thì mô hình mới hiệu quả.

---

#### **2.2 Dữ liệu – Chìa khóa thành công trong ML**

Thuật toán có thể học từ dữ liệu để **dự đoán hoặc phân loại**, nhưng nếu **dữ liệu không đầy đủ, sai lệch hoặc không đại diện**, thì:

- Kết quả học sẽ **thiếu chính xác**.    
- Mô hình sẽ **khó tổng quát hóa** cho dữ liệu thực tế.

Do đó, thay vì tập trung chỉ vào việc chọn thuật toán “xịn”, **việc thu thập và xử lý dữ liệu đúng cách còn quan trọng hơn**.

**So sánh nhanh:**

|**Trường hợp**|**Hiệu quả mô hình**|
|---|---|
|Thuật toán mạnh + Dữ liệu ít/không tốt|**Kém**|
|Thuật toán trung bình + Dữ liệu tốt và nhiều|**Tốt**|

---

#### **2.3 Nguồn dữ liệu đến từ đâu?**

Các công ty công nghệ lớn như **Facebook, Google, Amazon** thành công phần lớn là nhờ:

- **Nguồn dữ liệu khổng lồ** do người dùng tạo ra mỗi ngày (post, like, comment,…).    
- Dữ liệu đó **được người dùng gán nhãn gián tiếp** (ví dụ: like = thích, share = quan tâm).

Do đó, **dữ liệu càng nhiều, chất lượng càng tốt**, thì khả năng mô hình học đúng càng cao.

---

#### **2.4 Vấn đề đặc thù với dữ liệu trong An ninh mạng**

Dữ liệu trong cybersecurity có một số điểm đặc biệt:

- **Khó thu thập**: nhiều dữ liệu mạng là **nhạy cảm**, không thể công khai.
    
- **Khó gán nhãn**: ví dụ, rất khó để biết 1 hành vi là **bình thường** hay **tấn công**.
    
- Dữ liệu thường **không cân bằng (imbalanced)**: chỉ 1% là tấn công, còn lại là hoạt động bình thường.
    
- Dữ liệu có thể ở dạng **phi cấu trúc** (unstructured): log, email, packet capture,…

Vì vậy, bước **tiền xử lý và tạo features** cực kỳ quan trọng và phức tạp hơn nhiều so với các bài toán ML thông thường.

---

#### **2.5 Ghi nhớ**

- **Dữ liệu tốt** là điều kiện tiên quyết cho thành công của một mô hình ML.
    
- **Cybersecurity data** khác biệt ở tính chất, nguồn, cách gán nhãn và tỷ lệ phân bố.
    
- Nắm được cách **chuyển đổi dữ liệu thô** thành tập dữ liệu dùng cho huấn luyện là bước đầu để áp dụng ML vào an ninh mạng.

---


### **3. Sự khác biệt giữa ML truyền thống và ML cho An ninh mạng**

#### **3.1 Tóm tắt nội dung chính**

Phần này làm rõ sự khác biệt then chốt giữa việc ứng dụng học máy trong các lĩnh vực truyền thống như y tế, tài chính, tiếp thị… so với lĩnh vực **an ninh mạng**. Mấu chốt không nằm ở **thuật toán**, mà nằm ở **dữ liệu đầu vào** và **cách biểu diễn dữ liệu**.

---

#### **3.2 Điểm giống nhau**

- **Các thuật toán ML không thay đổi**: Dù là nhận diện hình ảnh, phát hiện bệnh, hay phát hiện tấn công mạng thì bạn vẫn có thể dùng các thuật toán như:
    
    - **SVM (Support Vector Machine)** – Máy vector hỗ trợ
        
    - **Decision Trees** – Cây quyết định
        
    - **KNN** – K láng giềng gần nhất
        
    - **Neural Networks** – Mạng nơ-ron
        
- **Quy trình cơ bản giống nhau**:
    
    - Thu thập dữ liệu → xử lý → trích xuất đặc trưng → huấn luyện mô hình → đánh giá kết quả

---

#### **3.3 Khác biệt lớn nhất: DỮ LIỆU**

Sự khác biệt cốt lõi giữa ML truyền thống và ML cho cybersecurity **nằm ở dữ liệu đầu vào và cách biểu diễn nó**, cụ thể:

|**ML truyền thống**|**ML cho Cybersecurity**|
|---|---|
|Dữ liệu rõ ràng, dễ gán nhãn (ví dụ: hình ảnh mèo, chó)|Dữ liệu phức tạp, nhiều dạng (log, network packet, hành vi người dùng)|
|Đa phần là dữ liệu tĩnh|Thường là **dữ liệu thời gian thực (real-time)**|
|Tập dữ liệu công khai, dễ lấy|Dữ liệu **bảo mật**, khó truy cập và nhãn thường **không có sẵn**|
|Dữ liệu thường có phân bố cân bằng|Dữ liệu thường **mất cân bằng nghiêm trọng** (99% normal, 1% attack)|

---

#### **3.4 Ví dụ minh họa**

- **ML truyền thống**: phân loại thư là “spam” hay “not spam” từ nội dung email (rất nhiều dữ liệu có nhãn sẵn).
    
- **ML cho cybersecurity**: phát hiện hành vi tấn công từ log hệ thống, trong khi **không rõ hành vi nào là tấn công**, hoặc **hacker cố tình làm giống hành vi bình thường** → cần kỹ thuật phân tích phức tạp hơn.

---

#### **3.5 Điều gì thay đổi khi ứng dụng ML cho Cybersecurity?**

- **Cách biểu diễn dữ liệu (data representation)** thay đổi:
    
    - Cần chuyển log, lưu lượng mạng,… thành **ma trận mẫu – đặc trưng (samples – features)**.
        
    - Phải **gán nhãn thủ công hoặc dùng các phương pháp bán giám sát/không giám sát**.
        
    
- **Chiến lược trích xuất feature (feature extraction)** trở nên quan trọng hơn bao giờ hết:
    
    - Ví dụ: từ log hệ thống, cần trích được số lượng login thất bại, khoảng thời gian giữa các yêu cầu, địa chỉ IP bất thường,…

---

#### **3.6 Ghi nhớ**

- ML truyền thống và ML cho cybersecurity dùng **thuật toán giống nhau**, nhưng khác **loại dữ liệu** và **cách xử lý dữ liệu**.
    
- Làm ML trong cybersecurity cần chú trọng nhiều vào:
    
    - **Tiền xử lý dữ liệu**
        
    - **Trích xuất feature phù hợp**
        
    - **Xử lý dữ liệu không gán nhãn và mất cân bằng**


---


### **4. Đặc điểm của Tập dữ liệu (Dataset)**

#### **4.1 Tóm tắt nội dung chính**

Khi làm việc với học máy, bạn cần tư duy dữ liệu dưới dạng **ma trận (matrix)** – mỗi dòng là một **mẫu (sample)** và mỗi cột là một **đặc trưng (feature)**. Phần này sẽ giúp bạn hiểu cách tổ chức dữ liệu phù hợp để đưa vào mô hình học máy, bao gồm cả cách xử lý trong Python.

---

#### **4.2 Tư duy dữ liệu dưới dạng ma trận**

Trong học máy, tập dữ liệu thường được biểu diễn như một **ma trận 2 chiều**:

- **Hàng (row)**: mỗi hàng tương ứng với một **mẫu (sample)** – ví dụ, một kết nối mạng, một phiên đăng nhập, một email,…
    
- **Cột (column)**: mỗi cột tương ứng với một **đặc trưng (feature)** – ví dụ, số lần đăng nhập thất bại, độ dài URL, địa chỉ IP nguồn,…

👉 Ma trận này có thể được load và xử lý trong Python bằng **NumPy** như sau:

```python
Matrix_data = np.loadtxt('dataset.csv', delimiter=",", skiprows=1)
X = Matrix_data[:, :4]   # lấy các cột đặc trưng
y = Matrix_data[:, 4]    # lấy cột nhãn (label)
```

- X là ma trận các feature (ví dụ: độ dài packet, số lượng bytes,…).
    
- y là mảng nhãn tương ứng (ví dụ: 0 = bình thường, 1 = tấn công).

---

#### **4.3 Đặc trưng (Feature) và Nhãn (Label)**

- **Feature**: là thông tin định lượng giúp mô hình phân biệt giữa các tình huống khác nhau.
    
- **Label**: là kết quả đúng tương ứng với mỗi mẫu, dùng trong **supervised learning**.

---

#### **4.4 Thực hành với bộ dữ liệu Iris**

Ví dụ đơn giản nhưng kinh điển là **Iris Dataset** – bộ dữ liệu về hoa:

- Có tổng cộng **150 mẫu**.
    
- Mỗi mẫu có **4 đặc trưng** như chiều dài cánh, chiều rộng đài hoa,…
    
- Có **3 nhãn** phân loại hoa: _Setosa_, _Versicolour_, _Virginica_.

Ma trận mẫu có dạng:

```
[[5.1  3.5  1.4  0.2  0]
 [4.9  3.0  1.4  0.2  0]
 ...
 [5.9  3.0  5.1  1.8  2]]
```

- 4 cột đầu là feature.
    
- Cột cuối là label (0, 1, 2 tương ứng với loại hoa).

---

#### **4.5 Tập dữ liệu trong An ninh mạng**

Khi chuyển sang lĩnh vực cybersecurity, ma trận dữ liệu có thể phức tạp hơn:

- Mỗi dòng là một phiên kết nối (network flow), một dòng log, hoặc một hành vi người dùng.
    
- Các cột có thể bao gồm: địa chỉ IP, thời gian phiên, số lượng packet, loại giao thức,…
    
- Cần xử lý để chuyển các thông tin này thành số (ví dụ: dùng One-hot encoding hoặc LabelEncoder cho các cột dạng text).

---

#### **4.6 Ghi nhớ**

- Trong ML, **dataset = ma trận (samples × features)**.
    
- Hiểu rõ cấu trúc dữ liệu là **bước đầu tiên để tiền xử lý và huấn luyện mô hình thành công**.
    
- Tập dữ liệu tốt cần phải:
    
    - Có đủ số lượng mẫu.
        
    - Có feature mang thông tin hữu ích.
        
    - Được gán nhãn đúng (nếu dùng supervised learning).


---


### **5. Một số Tập Dữ liệu Thường gặp trong ML cho An ninh mạng**

#### **5.1 Tóm tắt nội dung chính**

Phần này giới thiệu các tập dữ liệu phổ biến được sử dụng để huấn luyện và kiểm thử các mô hình học máy trong lĩnh vực an ninh mạng. Mỗi tập có đặc điểm riêng, phục vụ cho các mục tiêu như phát hiện phishing, malware, xâm nhập mạng, gian lận,…

---

#### **5.2 Phân loại các tập dữ liệu**

##### **5.2.1 Dữ liệu dạng văn bản (Text Dataset)**

- **Phishing Websites Dataset**: tập dữ liệu gồm các đặc trưng rút ra từ URL, nội dung HTML,… giúp phát hiện website lừa đảo.
    
- Các feature thường gặp: độ dài URL, chứa IP hay không, số lượng dấu “@” hoặc “https”,…

##### **5.2.2 Dữ liệu hình ảnh (Image Dataset)**

- Ít phổ biến hơn trong cybersecurity, nhưng có thể dùng trong:
    
    - **Phát hiện malware**: bằng cách chuyển file nhị phân thành ảnh (dạng heatmap hoặc grayscale).
        
    - **Phân tích CAPTCHA**, nhận dạng khuôn mặt trong hệ thống giám sát.

##### **5.2.3 Dữ liệu âm thanh (Speech Dataset)**

- Ứng dụng trong **biometric authentication**: xác thực người dùng bằng giọng nói.
    
- Cần xử lý tín hiệu thành vector đặc trưng (MFCC – Mel Frequency Cepstral Coefficients).

---

#### **5.3 Dữ liệu mạng và xâm nhập hệ thống**

##### **5.3.1 NSL-KDD Dataset**

- Là phiên bản cải tiến của **KDD’99**, dùng để phát hiện tấn công mạng.
    
- Gồm 41 đặc trưng như: số lượng byte gửi/nhận, cổng giao tiếp, flag TCP,…
    
- Nhãn (label): _normal_ hoặc một trong các loại tấn công như DoS, Probe, R2L, U2R.

##### **5.3.2 UNSW-NB15**

- Tập dữ liệu hiện đại hơn NSL-KDD, mô phỏng lưu lượng mạng thực tế.
    
- Bao gồm cả lưu lượng **bình thường và tấn công**, với nhãn rõ ràng.
    
- Có thể dùng cho các mô hình supervised hoặc semi-supervised.

##### **5.3.3 Honeypot (Unsupervised)**

- Thu thập dữ liệu từ các **honeypot** – hệ thống bẫy tấn công.
    
- Dữ liệu thường **chưa gán nhãn**, phù hợp cho mô hình **unsupervised learning** (ví dụ: clustering, anomaly detection).

---

#### **5.4 Dữ liệu khác**

##### **5.4.1 Malware Dataset**

- Tập dữ liệu chứa các **file thực thi**, hoặc đặc trưng từ phân tích hành vi (sandbox logs).
    
- Mục tiêu: phân loại file là **malware** hay **benign** (vô hại).
  
##### **5.4.2 Fraud Detection**

- Dùng trong các hệ thống **phát hiện gian lận** (ví dụ: giao dịch thẻ tín dụng).
    
- Dữ liệu thường bị **mất cân bằng nặng**: tỷ lệ gian lận rất nhỏ (~0.1%).

##### **5.4.3 Biometrics**

- Dữ liệu sinh trắc học: vân tay, khuôn mặt, mống mắt, giọng nói.
    
- Ứng dụng trong hệ thống xác thực, kiểm soát truy cập (access control).

---

#### **5.5 So sánh nhanh các tập dữ liệu**

|**Loại dữ liệu**|**Ứng dụng**|**Đặc điểm nổi bật**|
|---|---|---|
|NSL-KDD|Phát hiện xâm nhập mạng|Có nhãn, đặc trưng chuẩn hóa sẵn|
|UNSW-NB15|Phát hiện tấn công mạng|Cập nhật hơn, phản ánh lưu lượng thực tế|
|Phishing Dataset|Chống lừa đảo website|Feature dễ trích xuất từ URL/HTML|
|Honeypot|Phân tích hành vi tấn công|Không có nhãn, dùng unsupervised|
|Fraud Detection|Giao dịch tài chính|Mất cân bằng dữ liệu|
|Malware Dataset|Phân loại mã độc|Cần xử lý tĩnh hoặc động từ file thực thi|

---

#### **5.6 Ghi nhớ**

- Mỗi bài toán trong cybersecurity sẽ yêu cầu **tập dữ liệu phù hợp**.
    
- **Có nhãn hay không** sẽ quyết định dùng **supervised** hay **unsupervised learning**.
    
- Cần hiểu rõ **đặc điểm từng loại dữ liệu** để chọn mô hình, kỹ thuật xử lý phù hợp.


---


### **6. Khái niệm Features là gì?**

#### **6.1 Tóm tắt nội dung chính**

Phần này giúp ta hiểu rõ **“feature” (đặc trưng)** là gì trong học máy, và tại sao nó lại đóng vai trò **trung tâm trong quá trình học** của mô hình. Đây là cầu nối giữa dữ liệu thô và mô hình machine learning.

---

#### **6.2 Feature là gì?**

- **Feature (Đặc trưng)** là cách để **biểu diễn một mẫu dữ liệu** thông qua các giá trị số (numerical values) hoặc nhị phân.
    
- Một **mẫu (sample)** sẽ được biểu diễn bằng một **vector đặc trưng**.

**Ví dụ thực tế:**

- Với dữ liệu về người dùng mạng:
    
    - Số lần đăng nhập thất bại
        
    - Thời gian hoạt động trung bình
        
    - Địa chỉ IP đã dùng
        
    - Tỉ lệ gửi gói tin đến cổng lạ
        
        → Đây đều có thể là **features** để mô hình học cách phân biệt hành vi bình thường và bất thường.

---

#### **6.3 Vector không gian đặc trưng (Vector Space Model)**

Trong học máy, mỗi mẫu được biểu diễn như một điểm trong **không gian nhiều chiều**, mỗi chiều tương ứng với một feature:

- Ví dụ:
    
    Nếu bạn có 3 feature → mỗi mẫu là một điểm trong **không gian 3 chiều**
    
    Nếu có 100 feature → mẫu nằm trong **không gian 100 chiều (high-dimensional space)**

👉 Mô hình ML sẽ học cách **vẽ đường ranh giới phân loại** các điểm trong không gian này.

---

#### **6.4 Ví dụ minh họa đơn giản**

Giả sử bạn muốn phân loại email thành “spam” và “not spam”, bạn có thể dùng các feature như:

|**Feature**|**Giá trị mẫu 1**|**Giá trị mẫu 2**|
|---|---|---|
|Số lần xuất hiện từ “free”|3|0|
|Có chứa từ “win” không?|1 (có)|0 (không)|
|Tổng số từ trong email|150|80|
|Độ dài tiêu đề|30|10|

→ Mỗi mẫu email là một vector đặc trưng: $[3, 1, 150, 30]$

---

#### **6.5 Các bài toán Cybersecurity cần trích xuất Feature như thế nào?**

Tùy loại dữ liệu, cách trích xuất feature sẽ khác nhau:

- **Log hệ thống**: đếm số dòng lỗi, loại lỗi, thời gian giữa các lỗi.
    
- **Gói tin mạng (packet)**: độ dài gói, giao thức sử dụng, cổng gửi/nhận.
    
- **Website phishing**: độ dài URL, số lượng redirect, chứa ký tự lạ.    

Việc chọn **đúng feature phù hợp** là yếu tố quyết định mô hình có học tốt hay không.

---

#### **6.6 Ghi nhớ**

- **Feature là yếu tố quan trọng nhất** ảnh hưởng đến hiệu quả của mô hình học máy.
    
- Mỗi mẫu được mô tả bằng **một vector đặc trưng**.
    
- Trong cybersecurity, **kỹ thuật trích xuất và chọn lọc feature** là bước then chốt để phát hiện tấn công hiệu quả.


---


### **7. Các Loại Features**

#### **7.1 Tóm tắt nội dung chính**

Phần này phân loại các **kiểu đặc trưng (features)** thường gặp trong học máy, giúp bạn hiểu cách chọn và xử lý từng loại. Ngoài ra, ta cũng tìm hiểu khái niệm **chiều dữ liệu (dimensionality)** – một yếu tố rất quan trọng ảnh hưởng đến hiệu quả của mô hình.

---

#### **7.2 Phân loại Feature theo kiểu dữ liệu**
##### **7.2.1 Feature nhị phân (Binary Feature)**

- Chỉ nhận **2 giá trị: 0 hoặc 1**.
    
- Thường biểu thị **sự có mặt/không có mặt** của một đặc điểm.

Ví dụ:

- Email có chứa từ “free” không? → 1 = Có, 0 = Không
    
- IP truy cập từ quốc gia nằm trong blacklist không? → 1 = Có, 0 = Không

##### **7.2.2 Feature liên tục (Continuous Feature)**

- Có thể nhận **bất kỳ giá trị số thực nào** trong một khoảng.
    
- Thường dùng để biểu thị **độ lớn, tần suất, thời gian,…**

Ví dụ:

- Số lượng byte gửi đi
    
- Thời gian trung bình giữa 2 gói tin
    
- Chiều dài URL

---

#### **7.3 Chiều dữ liệu (Dimensionality)**

- Là **số lượng feature** dùng để mô tả một mẫu.
    
- Một mẫu với 10 feature → thuộc không gian 10 chiều.

> **Chiều càng cao → Mô hình càng mạnh → Nhưng cũng càng dễ overfit.**

**Hệ quả:**

- Dữ liệu càng nhiều feature thì càng **phức tạp**.
    
- Nếu số chiều quá lớn → cần **giảm chiều (dimensionality reduction)** để:
    
    - Tăng tốc độ huấn luyện
        
    - Tránh mô hình học quá chi tiết và **không tổng quát được** (overfitting)

---

#### **7.4 Tóm tắt bằng bảng**

|**Loại Feature**|**Giá trị**|**Ví dụ thực tế**|
|---|---|---|
|**Nhị phân (Binary)**|0 hoặc 1|Có chứa “http” trong URL không? (1/0)|
|**Liên tục (Continuous)**|Số thực|Thời gian hoạt động, số byte, độ dài tiêu đề|
|**Chiều dữ liệu (Dimensionality)**|Tổng số feature|5 feature = 5 chiều; 100 feature = 100 chiều|

---

#### **7.5 Ghi nhớ**

- Feature có thể là **nhị phân hoặc liên tục** → chọn loại phù hợp theo bài toán.
    
- **Chiều dữ liệu cao không phải lúc nào cũng tốt** → cần kiểm soát để tránh quá khớp.
    
- Một bước rất quan trọng là **chuẩn hóa (scaling)** dữ liệu, đặc biệt với feature liên tục → phần này sẽ được nói rõ hơn ở các phần sau.


---


### **8. Phân loại Học máy (Machine Learning Classification)**

#### **8.1 Tóm tắt nội dung chính**

Phần này sẽ giúp bạn hiểu rõ các **nhánh chính trong học máy (machine learning)**, bao gồm:

- **Học có giám sát (supervised learning)** và **không giám sát (unsupervised learning)**,
    
- Sự khác biệt giữa **phân loại (classification)** và **hồi quy (regression)**,
    
- Các mô hình xử lý **dữ liệu tuần tự (sequential)** và **phi tuần tự (non-sequential)**.

---

#### **8.2 Phân loại theo cách học**

##### **8.2.1 Supervised Learning (Học có giám sát)**

- Là hình thức học từ dữ liệu đã **gán nhãn (labelled)**.
    
- Mục tiêu: học ra một hàm dự đoán f(x) → để dự đoán nhãn cho mẫu mới.

Ví dụ:

- Phát hiện email là spam hay không, dựa trên dữ liệu đã biết trước.
  
✅ Yêu cầu: phải có dữ liệu mẫu + nhãn chính xác tương ứng.

##### **8.2.2 Unsupervised Learning (Học không giám sát)**

- Dùng khi **không có nhãn** trong dữ liệu.
    
- Mục tiêu: **tìm cấu trúc ẩn** trong dữ liệu, như nhóm (cluster), dị thường (anomaly),…

Ví dụ:

- Phân nhóm người dùng theo hành vi truy cập mà không biết trước họ là ai.

---

#### **8.3 Phân loại theo mục tiêu dự đoán**

##### **8.3.1 Classification (Phân loại)**

- Mô hình dự đoán đầu ra là **một lớp (class)** thuộc danh sách các nhãn có sẵn.
  
Ví dụ:

- Nhãn = normal, attack
    
- Dự đoán xem kết nối mạng thuộc loại nào.    

##### **8.3.2 Regression (Hồi quy)**

- Mô hình dự đoán đầu ra là **một giá trị liên tục (số thực)**.
  
Ví dụ:

- Dự đoán số lượng truy cập vào hệ thống trong giờ tới: 105.5, 98.3,…

---

#### **8.4 Phân loại theo dạng dữ liệu**

##### **8.4.1 Sequential Data (Dữ liệu tuần tự)**

- Dữ liệu có thứ tự theo thời gian hoặc chuỗi.
    
- Cần dùng các mô hình như **RNN, LSTM** (Recurrent Neural Networks).

Ví dụ:

- Dự đoán các bước tiếp theo của một cuộc tấn công mạng theo chuỗi hành vi.
  
##### **8.4.2 Non-Sequential Data (Dữ liệu phi tuần tự)**

- Dữ liệu không có thứ tự rõ ràng.
    
- Dùng các mô hình truyền thống như SVM, Decision Tree, KNN,…

---

#### **8.5 Tóm tắt bằng sơ đồ phân loại**

```
Machine Learning
├── Supervised Learning
│   ├── Classification (phân lớp)
│   └── Regression (hồi quy)
├── Unsupervised Learning
│   └── Clustering / Anomaly Detection
├── Sequential vs Non-Sequential (phân loại theo định dạng dữ liệu)
```

---

#### **8.6 Ghi nhớ**

- **Supervised**: cần dữ liệu gán nhãn → áp dụng cho bài toán phân loại tấn công mạng.
    
- **Unsupervised**: dùng khi không có nhãn → phù hợp với dữ liệu từ honeypot, log chưa xử lý.
    
- **Classification vs Regression**: hiểu rõ mục tiêu đầu ra là rời rạc hay liên tục.
    
- Với dữ liệu mạng (network logs), **dạng sequential** ngày càng phổ biến → cần mô hình xử lý chuỗi.


---


### **9. Một số Thuật toán Machine Learning phổ biến**

#### **9.1 Tóm tắt nội dung chính**

Phần này giới thiệu các **thuật toán học máy phổ biến nhất** được sử dụng để xây dựng hệ thống phân loại trong an ninh mạng. Các thuật toán này có thể áp dụng cho cả **bài toán phân lớp** (classification) và trong một số trường hợp là **dự báo số liệu (regression)**.

---

#### **9.2 Các thuật toán phân loại phổ biến**

##### **9.2.1 SVM – Support Vector Machine**

- Tạo **đường biên tối ưu** để phân chia các lớp.
    
- Phù hợp với dữ liệu **có thể phân tách tuyến tính hoặc phi tuyến tính**.
    
- Có thư viện **LibSVM** nổi tiếng để cài đặt.

##### **9.2.2 Naïve Bayes**

- Dựa trên **xác suất Bayes** và giả định đơn giản là các feature độc lập với nhau.
    
- Rất nhanh và hiệu quả với dữ liệu dạng văn bản (như phát hiện spam/phishing).

##### **9.2.3 Decision Trees**

- Dự đoán bằng cách đi qua **các nhánh điều kiện**.
    
- Dễ hiểu, dễ triển khai, nhưng dễ bị overfit nếu không cắt tỉa (prune).

##### **9.2.4 Random Forest**

- Là tập hợp của nhiều cây quyết định (ensemble model).
    
- **Ổn định hơn** Decision Tree đơn lẻ nhờ voting trung bình từ nhiều cây.

##### **9.2.5 K-Nearest Neighbors (KNN)**

- Phân loại dựa trên **k láng giềng gần nhất** trong không gian feature.
    
- Đơn giản, nhưng chậm với tập dữ liệu lớn vì phải tính khoảng cách với tất cả mẫu.

---

#### **9.3 Mạng nơ-ron và Học sâu (Deep Learning)**

##### **9.3.1 Neural Networks**

- Mô hình mô phỏng cách hoạt động của **não người**, với các lớp đầu vào – ẩn – đầu ra.
    
- **Mạnh trong xử lý dữ liệu phi tuyến tính**, nhưng cần nhiều dữ liệu để học tốt.  

##### **9.3.2 Deep Learning**

- Là mạng nơ-ron với **nhiều tầng (deep)** → có thể tự động học đặc trưng từ dữ liệu.
    
- Ví dụ: **Multilayer Perceptron (MLP)** – mạng nơ-ron nhiều lớp.
    
- Với đủ dữ liệu và tài nguyên tính toán, DL có thể **thay thế hoàn toàn feature engineering thủ công**.

> Deep Learning = Neural Network + Nhiều lớp + GPU mạnh

---

#### **9.4 Khi nào dùng thuật toán nào?**

|**Thuật toán**|**Khi nào dùng?**|**Ưu điểm**|**Nhược điểm**|
|---|---|---|---|
|**SVM**|Dữ liệu có số chiều cao, cần phân lớp rõ|Hiệu quả, mạnh mẽ|Tốn tài nguyên nếu dữ liệu lớn|
|**Naïve Bayes**|Dữ liệu văn bản, phân loại nhanh|Tốc độ nhanh, đơn giản|Giả định feature độc lập hơi lý tưởng|
|**Decision Tree**|Cần mô hình dễ hiểu, dễ giải thích|Dễ hiểu, trực quan|Dễ overfit nếu không cắt cây|
|**Random Forest**|Muốn tăng độ chính xác và giảm overfit|Ổn định, mạnh mẽ|Khó diễn giải hơn cây đơn lẻ|
|**KNN**|Dữ liệu nhỏ, dễ hình dung bằng khoảng cách|Đơn giản, không cần huấn luyện|Chậm nếu dữ liệu lớn|
|**Neural Network**|Dữ liệu phức tạp, cần học phi tuyến|Mô hình mạnh, tổng quát tốt|Cần nhiều dữ liệu, khó tinh chỉnh|
|**Deep Learning**|Dữ liệu rất lớn, bài toán phức tạp|Tự động trích xuất feature|Rất tốn tài nguyên, khó giải thích|

---

#### **9.5 Ghi nhớ**

- **Không có thuật toán “tốt nhất” – chỉ có thuật toán phù hợp nhất với bài toán cụ thể.**
    
- Với bài toán cybersecurity:
    
    - **Naïve Bayes**: Phishing detection.
        
    - **Random Forest/SVM**: Phát hiện tấn công dựa trên log.
        
    - **Deep Learning**: Nhận diện chuỗi hành vi, học đặc trưng tự động.


---


### **10. Feature Engineering và Vai trò của Deep Learning**

#### **10.1 Tóm tắt nội dung chính**

Phần này nói về **quá trình tạo ra các đặc trưng (features)** để đưa vào mô hình học máy – được gọi là **Feature Engineering (Kỹ thuật xử lý đặc trưng)**. Đây từng là một bước **rất thủ công và tốn công sức**, nhưng ngày nay **Deep Learning (học sâu)** đã phần nào thay đổi cuộc chơi.

---

#### **10.2 Feature Engineering là gì?**

- Là quá trình:
    
    - **Chọn lựa**, **chuyển đổi**, hoặc **tạo mới các feature** từ dữ liệu gốc.
        
    - Nhằm mục tiêu: giúp mô hình học máy **hiểu và phân loại dữ liệu tốt hơn**.

**Ví dụ:**

Từ log hệ thống gốc:

- Dữ liệu thô: user1 đăng nhập lúc 08:00, thất bại
    
- Feature có thể trích xuất:
    
    - Số lần đăng nhập thất bại trong 1 giờ
        
    - Thời gian giữa 2 lần đăng nhập
        
    - User đăng nhập từ IP lạ hay không?
  

> 👉 **Kỹ năng trích xuất feature hiệu quả chính là “nghệ thuật” trong học máy!**

---

#### **10.3 Trước đây: Phụ thuộc vào con người**

- Trong quá khứ, việc chọn feature phù hợp **phụ thuộc hoàn toàn vào chuyên gia (domain expert)**.
    
- Điều này khiến quá trình xây dựng mô hình:
    
    - **Chậm**, **khó tái sử dụng**, dễ mắc sai sót.
        
    - Tốn nhiều thời gian cho từng bài toán cụ thể.

---

#### **10.4 Ngày nay: Deep Learning làm thay**

- Deep learning, với mạng nhiều lớp, **tự động học đặc trưng từ dữ liệu**.
    
- Mỗi lớp ẩn trong mạng học một cấp độ biểu diễn khác nhau:
    
    - Lớp đầu học đặc trưng thô (raw pattern)
        
    - Lớp giữa học đặc trưng trừu tượng
        
    - Lớp cuối học đặc trưng phân biệt để ra quyết định

**Ưu điểm:**

- **Không cần phải nghĩ ra đặc trưng thủ công**
    
- Giúp xử lý **dữ liệu phi cấu trúc** như hình ảnh, log chuỗi, âm thanh…  

> 👉 Nhờ deep learning, một số ngành như nhận diện khuôn mặt, dịch ngôn ngữ, phát hiện hành vi tấn công… **phát triển vượt bậc** trong 10 năm gần đây.

---

#### **10.5 Nhưng vẫn cần Feature Engineering thủ công?**

Dù deep learning rất mạnh, **trong lĩnh vực an ninh mạng**, chúng ta vẫn **cần kết hợp cả 2**:

|**Tình huống**|**Nên dùng phương pháp nào?**|
|---|---|
|Dữ liệu nhỏ, có cấu trúc|Feature engineering thủ công|
|Dữ liệu lớn, không gán nhãn nhiều|Deep learning tự học feature|
|Hệ thống cần giải thích dễ|Feature thủ công, mô hình rõ ràng (VD: Decision Tree)|
|Hệ thống cần phát hiện hành vi phức tạp|Deep learning (VD: RNN, MLP)|

---

#### **10.6 Ghi nhớ**

- Feature Engineering là **bước quyết định độ hiệu quả** của mô hình học máy.
    
- **Deep learning** có thể học feature tự động, nhưng **không thay thế hoàn toàn kỹ thuật thủ công**.
    
- Trong cybersecurity, cần cân bằng giữa **sự tự động hóa của DL** và **hiểu biết chuyên môn để thiết kế feature tốt**.


---


### **11. Các thư viện phổ biến trong Python cho Machine Learning**

#### **11.1 Tóm tắt nội dung chính**

Phần này giới thiệu những **thư viện Python quan trọng nhất** hỗ trợ quá trình xây dựng, huấn luyện và đánh giá mô hình học máy. Đây là **bộ công cụ không thể thiếu** với bất kỳ ai làm machine learning, đặc biệt là khi xử lý dữ liệu an ninh mạng.

---

#### **11.2 Thư viện nền tảng**

##### **11.2.1 NumPy**

- Dùng để **xử lý ma trận**, tính toán toán học nhanh chóng.
    
- Là “trái tim” cho các thao tác số học trong ML.
    
- Tương tự như **Matlab** trong toán ứng dụng.

```python
import numpy as np
np.set_printoptions(threshold=np.inf)  # hiển thị toàn bộ mảng
```

##### **11.2.2 Pandas**

- Dùng để xử lý **dữ liệu dạng bảng (DataFrame)** – rất tiện cho dữ liệu từ log, csv, SIEM alert.
    
- Cung cấp các công cụ:
    
    - Đọc file CSV
        
    - Lọc, nhóm, thống kê, chuyển đổi dữ liệu

```python
import pandas as pd
df = pd.read_csv("alerts.csv")
```

---

#### **11.3 Thư viện học máy**  

##### **11.3.1 scikit-learn (sklearn)**

- Thư viện ML truyền thống nổi tiếng nhất.
    
- Cung cấp:
    
    - Các thuật toán như: SVM, KNN, Decision Tree, Random Forest,…
        
    - Công cụ tiền xử lý: chuẩn hóa (scaling), mã hóa nhãn (LabelEncoder)
        
    - Công cụ đánh giá: accuracy, confusion matrix, precision, recall, f1-score

```python
from sklearn import datasets, preprocessing, metrics
from sklearn.model_selection import train_test_split
```

##### **11.3.2 matplotlib**

- Dùng để **vẽ đồ thị**, trực quan hóa dữ liệu và kết quả mô hình.

```python
import matplotlib.pyplot as plt
```

---

#### **11.4 Một số công cụ hữu ích khác**

|**Thư viện**|**Mục đích chính**|
|---|---|
|**LabelEncoder**|Mã hóa nhãn dạng text thành số (VD: ‘normal’ → 0)|
|**StandardScaler**|Chuẩn hóa giá trị feature (scale về cùng thang đo)|
|**train_test_split**|Tách dữ liệu thành tập huấn luyện và kiểm tra|
|**confusion_matrix**|Đánh giá chất lượng phân loại (TP, FP, FN, TN)|

---

#### **11.5 Ví dụ thực hành cơ bản**

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# Chuẩn hóa
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Dự đoán bằng model (giả sử đã huấn luyện)
y_pred = model.predict(X_test_scaled)

# Đánh giá
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
```

---

#### **11.6 Ghi nhớ**

- **scikit-learn** là công cụ chính khi bắt đầu học máy bằng Python.
    
- Kết hợp với **NumPy + Pandas** để xử lý dữ liệu hiệu quả.
    
- **Chuẩn hóa dữ liệu (scaling)** là bước bắt buộc khi dùng các mô hình như SVM, KNN, Deep Learning.
    
- **matplotlib** giúp trực quan hóa rất tốt cho việc trình bày và debug.


---


### **12. Tiền xử lý và Chia dữ liệu (Train-Test Split)**

#### **12.1 Tóm tắt nội dung chính**

Phần này hướng dẫn cách **chia dữ liệu thành các tập huấn luyện và kiểm tra**, một bước rất quan trọng để đánh giá mô hình học máy. Đồng thời, bạn sẽ học cách **chuẩn hóa dữ liệu (scaling)** – đặc biệt cần thiết khi sử dụng các thuật toán như SVM, KNN, hoặc Deep Learning.

---

#### **12.2 Tại sao phải chia dữ liệu?**

Khi huấn luyện mô hình ML, chúng ta không được “dạy và kiểm tra trên cùng một dữ liệu”, bởi điều đó sẽ gây **overfitting** (mô hình học thuộc lòng thay vì học tổng quát).

  

✅ Cách giải quyết: chia dữ liệu thành 2 phần:

- **Tập huấn luyện (training set)**: dùng để huấn luyện mô hình.
    
- **Tập kiểm tra (test set)**: dùng để kiểm tra khả năng tổng quát hóa.
  
**Ví dụ:**

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)
```

- test_size=0.3: 70% dùng để huấn luyện, 30% để kiểm tra.
    
- random_state=42: đảm bảo lần chạy nào cũng chia giống nhau (giúp tái lập kết quả).

---

#### **12.3 Tách nhãn và đặc trưng**

Giả sử bạn có một tập dữ liệu dạng ma trận:

```
X = Matrix_data[:, :4]   # 4 feature đầu
y = Matrix_data[:, 4]    # nhãn (label)
```

Kết quả:

- X_train, X_test: là ma trận các feature
    
- y_train, y_test: là mảng các nhãn tương ứng

---

#### **12.4 Chuẩn hóa dữ liệu (Normalization/Standardization)**

**Tại sao phải chuẩn hóa?**

- Một số thuật toán như **SVM**, **KNN**, **neural networks** rất nhạy cảm với **tỉ lệ giữa các feature**.
    
- Ví dụ: nếu một feature có giá trị từ 1–1000, còn feature khác chỉ từ 0–1 → mô hình sẽ “thiên vị” feature lớn hơn.
  

✅ Giải pháp: dùng **StandardScaler** để chuẩn hóa tất cả về cùng chuẩn.

**Cách chuẩn hóa:**

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

> Chỉ dùng **fit_transform** trên X_train, còn X_test phải dùng transform thôi để tránh “rò rỉ thông tin” từ tập kiểm tra vào mô hình.

---

#### **12.5 Ghi nhớ**

- **train-test split** giúp đánh giá mô hình một cách khách quan.
    
- **test_size** thường đặt 20–30%, tùy vào kích thước dữ liệu.
    
- **Chuẩn hóa dữ liệu** là bước cực kỳ quan trọng, đặc biệt với deep learning hoặc thuật toán dùng khoảng cách.
    
- Không chuẩn hóa nhãn (label) – chỉ chuẩn hóa đặc trưng (feature).


---


### **13. Tối ưu hóa trong Học máy (Optimization)**

#### **13.1 Tóm tắt nội dung chính**

Tối ưu hóa là **cốt lõi của học máy có giám sát (supervised learning)**. Mục tiêu là tìm ra **tập tham số tốt nhất** cho mô hình để nó đưa ra dự đoán chính xác nhất. Phần này sẽ giải thích khái niệm tối ưu hóa một cách dễ hiểu, thông qua thuật toán quen thuộc: **Gradient Descent (Giảm dốc)**.

---

#### **13.2 Tối ưu hóa là gì?**

- Trong quá trình học, mô hình cần học một hàm f(x) để dự đoán đầu ra đúng.
    
- Hàm này thường chứa **các tham số (parameters)** mà mô hình cần học, ví dụ như hệ số trọng số w, b,…
    
- Tối ưu hóa là **quá trình điều chỉnh các tham số này** sao cho sai số dự đoán **nhỏ nhất có thể**.

---

#### **13.3 Minh họa bằng đồ thị chi phí**

##### **13.3.1. Đồ thị này là gì?**

- Đó là một biểu đồ mô tả **mối quan hệ giữa giá trị của tham số mô hình** (ví dụ: w) và **mức độ sai số (cost)** mà mô hình tạo ra với tham số đó.
    
- Trục **X**: giá trị của tham số w.
    
- Trục **Y**: hàm chi phí J(w) – càng thấp thì dự đoán của mô hình càng chính xác.

##### **13.3.2. Hình dạng của đồ thị**

- Với các mô hình tuyến tính đơn giản, đồ thị chi phí có dạng **đường cong hình parabol mở lên** (giống như chữ U).
    
- Mục tiêu của quá trình học là tìm **đáy của đường cong này** – nơi cost nhỏ nhất → chính là giá trị tối ưu của w.

##### **13.3.3. Vai trò trong tối ưu hóa**

- Khi dùng **Gradient Descent**, ta như đang **“trượt xuống sườn dốc của đường cong chi phí”** để đến được điểm thấp nhất.
    
- Tại mỗi bước, ta dùng **đạo hàm** để biết dốc hiện tại là âm hay dương:
    
    - Nếu **gradient dương** → ta đi **sang trái**.
        
    - Nếu **gradient âm** → ta đi **sang phải**.

> Tại điểm đáy: **đạo hàm = 0** → đó là điểm hội tụ lý tưởng.

---

##### **13.3.4. Minh họa đơn giản**

Giả sử hàm chi phí của bạn là:

```
J(w) = w³ – 3w² + 7
```

- Hàm này có hình dạng giống như một **con dốc với đáy ở một điểm cụ thể**.
    
- Khi chạy gradient descent, ta bắt đầu từ một giá trị w nào đó (ví dụ: 4), rồi từ từ cập nhật w sao cho J(w) giảm dần.

**Biểu đồ trừu tượng:**

```
Cost (J)
  |
  |              *
  |           *     *
  |        *           *      ← quá trình giảm dốc
  |     *                 *
  |  *                      *
  |____________________________
                 w
```

---

##### **13.3.5. Tóm lại**

|**Thành phần**|**Vai trò trong tối ưu hóa**|
|---|---|
|Trục X (w)|Biểu diễn các giá trị tham số mô hình|
|Trục Y (J(w))|Biểu diễn sai số (loss) khi dùng tham số đó|
|Đường cong|Cho biết mức sai số tương ứng với từng giá trị w|
|Điểm thấp nhất|Là điểm tối ưu → nơi mô hình dự đoán tốt nhất (loss nhỏ nhất)|

---

**Ghi nhớ thêm**

- Đồ thị chi phí là **trực quan hóa** quan trọng để hiểu cách mô hình “học”.
    
- **Gradient Descent** chỉ là cách “lần mò xuống dốc” đến đáy của đường cong.
    
- Khi slope gần 0 → mô hình đã tiệm cận điểm tối ưu.    

---

#### **13.4 Giới thiệu Gradient Descent (Giảm dốc)**

**Ý tưởng chính:**

- Tại mỗi bước, tính **đạo hàm (gradient)** của hàm chi phí tại điểm hiện tại → gradient cho biết **hướng và độ dốc**.
    
- Dựa vào đó, **cập nhật tham số theo hướng ngược dốc** để tiến gần đến điểm tối ưu.


**Công thức cập nhật tham số:**

```python
new_x = old_x - learning_rate * gradient
```

- learning_rate: tốc độ học (bước nhảy)
    
- gradient: đạo hàm tại điểm old_x
    

---

#### **13.5 Ví dụ minh họa bằng code Python**

```python
old_x = 0
new_x = 4
step_size = 0.01
precision = 0.00001

def function_derivative(x):
    return 3*x**2 - 6*x   # Đạo hàm của hàm f(x) = x³ - 3x² + 7

while abs(new_x - old_x) > precision:
    old_x = new_x
    new_x = old_x - step_size * function_derivative(old_x)

print("Tối ưu tại x =", new_x)
```

👉 Ở đây, ta tối ưu một hàm đơn giản có đạo hàm rõ ràng. Trong thực tế, các mô hình ML (đặc biệt là deep learning) tối ưu hàng **nghìn – triệu tham số** cùng lúc.

---

#### **13.6 Các biến thể của Gradient Descent**

- **Batch Gradient Descent**: cập nhật theo toàn bộ dữ liệu.
    
- **Stochastic Gradient Descent (SGD)**: cập nhật theo từng mẫu → nhanh hơn nhưng dao động nhiều.
    
- **Mini-batch Gradient Descent**: kết hợp cả 2 – chia dữ liệu thành các nhóm nhỏ → phổ biến nhất hiện nay.
    

---

#### **13.7 Ghi nhớ**

- Tối ưu hóa là quá trình **điều chỉnh tham số để giảm sai số**.
    
- **Gradient Descent** là thuật toán nền tảng trong học máy hiện đại.
    
- Cần lựa chọn **learning rate phù hợp**: quá nhỏ → chậm, quá lớn → dao động, không hội tụ.
    
- Trong deep learning, còn có các biến thể mạnh hơn như **Adam**, **RMSProp**,…


---

