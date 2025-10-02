

#cyber_security #splunk #machine_learning

### **1. Giới thiệu chung về Splunk MLTK và AIOps**

**Tóm tắt nội dung**

Trong phần này, chúng ta sẽ cùng làm quen với Splunk Machine Learning Toolkit (MLTK) – một công cụ cực kỳ mạnh mẽ giúp phân tích dữ liệu bằng thuật toán học máy ngay bên trong Splunk. Ngoài ra, mình cũng sẽ giới thiệu nhanh khái niệm **AIOps** và mối liên hệ chặt chẽ giữa MLTK và hoạt động của một SOC hiện đại.

---

#### **1.1. Splunk MLTK là gì?**

**Splunk Machine Learning Toolkit (MLTK)** là một ứng dụng miễn phí trên Splunkbase cho phép bạn áp dụng **các thuật toán machine learning (học máy)** để phân tích dữ liệu đang lưu trữ hoặc streaming trên Splunk.

Điểm đặc biệt của MLTK là bạn **không cần phải là một chuyên gia về ML** – nhờ giao diện trực quan, bạn có thể dễ dàng:

- Huấn luyện mô hình (train model),
    
- Kiểm thử mô hình (test/validate),
    
- Triển khai mô hình vào quy trình phân tích thực tế.


Ví dụ đơn giản: bạn có thể dùng MLTK để học thói quen đăng nhập bình thường của người dùng, từ đó phát hiện ra các **hành vi bất thường** như đăng nhập vào lúc nửa đêm từ quốc gia lạ – một dấu hiệu tiềm năng của việc bị compromise.

---

#### **1.2. Vai trò của MLTK trong hệ sinh thái Splunk**

Trong bức tranh lớn của Splunk, MLTK đóng vai trò như **bộ não phân tích nâng cao (advanced analytics layer)**. Nó không thay thế các tính năng tìm kiếm (search), alert, hay dashboard truyền thống, mà **nâng cấp** chúng bằng khả năng học từ dữ liệu quá khứ và **tự động rút ra quy luật**.

Một số điểm mạnh của MLTK:

|**Tính năng**|**Vai trò**|
|---|---|
|**Phân tích dựa trên mô hình**|Thay vì chỉ dựa vào rule cố định, bạn có thể học mô hình từ dữ liệu thực tế.|
|**Hỗ trợ nhiều thuật toán**|Từ hồi quy (regression), phân cụm (clustering), đến phát hiện bất thường (anomaly detection).|
|**Tích hợp trực tiếp với SPL**|Có thể gọi mô hình ML ngay trong câu lệnh SPL để nhúng vào các dashboard hoặc alert.|

---

#### **1.3. Mối liên hệ giữa MLTK và AIOps**

**AIOps (Artificial Intelligence for IT Operations)** là xu hướng ứng dụng AI và ML để **phát hiện, chuẩn đoán và phản ứng với các sự cố IT một cách tự động**.

MLTK chính là nền tảng quan trọng giúp Splunk hiện thực hóa AIOps, với các khả năng như:

- **Phát hiện bất thường tự động (Anomaly Detection)** trong log hệ thống hoặc dữ liệu mạng.
    
- **Dự đoán sự cố (Predictive Analytics)** trước khi nó xảy ra.
    
- **Giảm cảnh báo giả (False Positive Reduction)** bằng cách học từ các cảnh báo trước đó.

Chẳng hạn, nếu trước đây một cảnh báo CPU sử dụng cao thường là “bình thường” vào cuối tuần (do backup định kỳ), thì MLTK có thể học được điều đó và **không còn tạo alert sai lệch nữa.**

---

**Chốt lại kiến thức**

- Splunk MLTK giúp bạn **mở rộng khả năng phân tích** của Splunk bằng việc áp dụng các mô hình học máy.
    
- Không cần biết sâu về ML – bạn vẫn có thể dùng giao diện **Assistants** để huấn luyện và triển khai mô hình.
    
- MLTK là nền tảng cốt lõi trong **chiến lược AIOps**, đặc biệt trong môi trường SOC hiện đại.

---

### **2. Các thành phần chính trong Splunk MLTK**

**Tóm tắt nội dung**

Phần này sẽ giúp bạn hiểu rõ cấu trúc và công cụ mà Splunk MLTK cung cấp để xây dựng và triển khai mô hình học máy. Từ việc chọn thuật toán phù hợp, sử dụng các “trợ lý” dựng sẵn, cho đến việc quản lý toàn bộ quá trình thử nghiệm – Splunk MLTK đều có giao diện hỗ trợ rất thân thiện.

---

#### **2.1. Machine Learning Algorithms (Thuật toán học máy)**

Splunk MLTK cung cấp **nhiều thuật toán học máy thông dụng**, có thể chia thành 3 nhóm chính tùy vào mục tiêu sử dụng:

|**Mục tiêu**|**Ví dụ thuật toán**|**Ứng dụng thực tế**|
|---|---|---|
|**Hồi quy (Regression)**|Linear Regression, SVR|Dự đoán CPU sử dụng, số lượng login, số lượng request,…|
|**Phân loại (Classification)**|Logistic Regression, SVM, Decision Tree|Phân loại sự kiện thành “nguy hiểm” hay “bình thường”|
|**Phân cụm (Clustering)**|K-means, DBSCAN|Phát hiện các nhóm hành vi bất thường|

**Ví dụ thực tế**

Nếu bạn muốn phát hiện **người dùng có hành vi bất thường**, bạn có thể dùng **K-means** để tìm các cụm hành vi phổ biến và nhận diện những điểm **nằm ngoài cụm** (outlier).

> **Lưu ý:** Tất cả các thuật toán đều có thể gọi từ SPL thông qua lệnh fit, apply, score, nên có thể tích hợp dễ dàng vào dashboard, alert hoặc automation.

---

#### **2.2. Assistants (Trợ lý hỗ trợ huấn luyện)**

Nếu bạn chưa quen với SPL hoặc mới làm quen với machine learning, thì **Assistants** chính là người bạn đồng hành lý tưởng.

Có thể hiểu Assistant là **giao diện có hướng dẫn từng bước (step-by-step)**, giúp bạn:

1. Chọn loại bài toán (dự đoán, phân loại, phân cụm,…)
    
2. Chọn trường dữ liệu đầu vào và nhãn đầu ra
    
3. Huấn luyện mô hình
    
4. Kiểm tra độ chính xác (accuracy, recall, F1,…)
    
5. Xuất ra câu SPL hoàn chỉnh để tái sử dụng

**Một số Assistants nổi bật:**

- **Predict Numeric Fields**: Dự đoán giá trị số (vd: mức sử dụng RAM, số lượng request)
    
- **Detect Numeric Outliers**: Phát hiện giá trị bất thường (vd: lượt truy cập bất thường vào hệ thống)
    
- **Cluster Events**: Gom nhóm các sự kiện tương tự (vd: nhóm các alert giống nhau)
    
- **Fit Model**: Tùy biến linh hoạt hơn, dùng khi bạn đã hiểu rõ dữ liệu

> **Hay nhất:** Sau khi làm việc trên Assistant, bạn có thể **copy SPL** được tạo ra và dán vào các workflow của mình.

---

#### **2.3. Experiments (Thí nghiệm)**

**Experiments** là phần trung tâm để bạn **quản lý quá trình huấn luyện, thử nghiệm và đánh giá mô hình ML**.

Khi bạn khởi tạo một thí nghiệm trong MLTK, bạn sẽ:

- Đặt tên cho thí nghiệm
    
- Chọn dữ liệu và thuật toán
    
- Thiết lập các tham số huấn luyện (hyperparameters)
    
- Kiểm tra kết quả qua đồ thị, bảng đánh giá
    
- Lưu mô hình (Save model) để sử dụng sau này

**Lợi ích của việc dùng Experiments:**

- **Tái sử dụng:** Có thể áp dụng mô hình đã huấn luyện vào các truy vấn khác bằng apply command
    
- **So sánh mô hình:** Bạn có thể huấn luyện nhiều mô hình trên cùng dữ liệu và so sánh độ chính xác của từng cái
    
- **Quản lý dễ dàng:** Tên mô hình, mô tả, ngày tạo,… đều được quản lý rõ ràng

> **Gợi ý:** Với mỗi loại use case (như phát hiện truy cập trái phép, hoặc dự đoán alert tăng cao), bạn nên tạo một Experiment riêng để dễ theo dõi.

---

**Chốt lại kiến thức**

- **Thuật toán học máy** trong MLTK giúp bạn xử lý nhiều loại bài toán: dự đoán, phân loại, phân cụm.
    
- **Assistants** là công cụ rất hữu ích để làm quen nhanh, không cần viết SPL phức tạp.
    
- **Experiments** giúp bạn quản lý toàn bộ quá trình huấn luyện, thử nghiệm, và đánh giá mô hình.


---


#### **2.4. Models (Mô hình đã lưu) và cách tái sử dụng**

**Mô hình ML trong Splunk được lưu ở đâu?**

Sau khi bạn hoàn thành một _experiment_ hoặc huấn luyện mô hình thông qua Assistant, Splunk sẽ lưu lại mô hình vào thư mục:

```bash
$SPLUNK_HOME/var/lib/splunk/modinput/mltk/models/
```

Tuy nhiên, trên giao diện MLTK, bạn có thể quản lý mô hình trực tiếp thông qua **Model Management**:

- Xem danh sách mô hình hiện có
    
- Kiểm tra ngày tạo, loại thuật toán, trường dữ liệu liên quan
    
- Xóa, cập nhật hoặc tái huấn luyện mô hình nếu cần

---

**Tái sử dụng mô hình bằng SPL**

Điểm mạnh của việc lưu mô hình là bạn có thể **dễ dàng áp dụng mô hình vào dữ liệu mới**, không cần huấn luyện lại mỗi lần.

Cú pháp SPL phổ biến để sử dụng lại mô hình:

```spl
| inputlookup new_login_data.csv
| apply my_model_name
```

Trong đó:

- my_model_name là tên mô hình đã lưu
    
- Lệnh apply sẽ dùng mô hình này để dự đoán hoặc phân loại dữ liệu mới  

**Ứng dụng thực tế:**

- Mô hình đã học hành vi đăng nhập bình thường → Dùng apply để phát hiện login bất thường trong ngày hôm nay
    
- Mô hình dự đoán số lượng alert → Dùng apply mỗi sáng để báo trước hôm nay có nguy cơ cao

> **Lưu ý:** Mô hình không tự động cập nhật, bạn cần định kỳ **tái huấn luyện (retrain)** nếu dữ liệu thay đổi đáng kể theo thời gian.

---

#### **2.5. SPL và MLTK: Viết SPL có tích hợp ML**

**Kết hợp sức mạnh của SPL và ML**

Splunk là một hệ thống dựa trên ngôn ngữ truy vấn SPL (Search Processing Language). Khi dùng MLTK, bạn có thể **nhúng trực tiếp các bước huấn luyện và dự đoán** vào dòng SPL của mình.

**Ví dụ: Huấn luyện mô hình tuyến tính (linear regression)**

```
| inputlookup server_cpu.csv
| fit LinearRegression "cpu_percent" from "hour_of_day" into "cpu_model"
```

- fit: Huấn luyện mô hình
    
- "cpu_percent": Trường cần dự đoán
    
- from "hour_of_day": Dữ liệu đầu vào
    
- into "cpu_model": Tên mô hình sẽ lưu

**Ví dụ: Áp dụng mô hình đã lưu**

```
| inputlookup today_cpu.csv
| apply cpu_model
```

Sau khi áp dụng, bạn sẽ có thêm trường mới predicted(cpu_percent) trong kết quả – đây là giá trị dự đoán của mô hình.

---

**Các lệnh SPL đặc biệt của MLTK**

|**SPL command**|**Chức năng**|
|---|---|
|fit|Huấn luyện mô hình|
|apply|Áp dụng mô hình đã lưu|
|score|Đánh giá độ chính xác|
|summary|Xem thông tin tổng quan của mô hình|
|partial_fit|Huấn luyện bổ sung (incremental learning, nếu thuật toán hỗ trợ)|

---

**Gợi ý nâng cao:**

Bạn có thể kết hợp ML với các lệnh như timechart, stats, lookup, where để tạo ra những dashboard thông minh, tự thích nghi theo dữ liệu.

---

**Chốt lại kiến thức**

- **Models** là mô hình đã được huấn luyện, có thể lưu lại và tái sử dụng dễ dàng bằng lệnh apply.
    
- Bạn có thể kết hợp SPL với ML để huấn luyện (fit) và áp dụng (apply) mô hình trong cùng một quy trình.
    
- MLTK biến Splunk từ một công cụ tìm kiếm log trở thành một hệ thống **phân tích thông minh, có khả năng học hỏi và dự đoán.**


---


### **3. Ứng dụng MLTK vào phân tích an toàn thông tin (Security Analytics)**

**Tóm tắt nội dung**

Từ phần này trở đi, chúng ta sẽ chuyển sang phần “chiến đấu” thực sự: dùng Splunk MLTK để **giải quyết các bài toán an ninh mạng trong SOC**. Ở mỗi mục, mình sẽ kết hợp **giải thích lý thuyết**, **use case thực tế**, và đặc biệt là **cách triển khai cụ thể bằng Splunk + MLTK** – để bạn có thể hình dung rõ ràng và áp dụng ngay.

---

#### **3.1. Phát hiện bất thường (Anomaly Detection)**

**Mục tiêu:**

Phát hiện **những hành vi không bình thường** trong hệ thống – những thứ mà các rule thông thường không nhận diện được. Đây là một ứng dụng rất quan trọng trong việc **phát hiện các cuộc tấn công ẩn danh**, như brute-force chậm, exfiltration nhỏ giọt, hoặc hành vi insider threat.

---


**A. Lý thuyết ngắn gọn**

**Anomaly Detection (Phát hiện bất thường)** là một kỹ thuật giúp xác định **các điểm dữ liệu không phù hợp với hành vi bình thường**.

Có hai phương pháp chính:

|**Loại**|**Mô tả**|**Ví dụ thực tế**|
|---|---|---|
|**Unsupervised Learning**|Không cần nhãn. Học từ dữ liệu quá khứ để xác định “bình thường”, sau đó tìm ra điểm bất thường.|K-means, DBSCAN, Isolation Forest|
|**Statistical Approach**|Dựa trên phân phối thống kê (z-score, IQR) để xác định outlier.|Dùng stdev, mean, hoặc forecast trong Splunk|

---

**B. Ví dụ thực tế: Phát hiện đăng nhập bất thường**

**Mô tả tình huống:**

Giả sử SOC của bạn muốn phát hiện **các phiên đăng nhập bất thường vào tài khoản người dùng**. Hành vi thông thường của mỗi người dùng rất khác nhau – nên rule-based detection thường rất dễ bị sai lệch hoặc bỏ sót.

**Dữ liệu cần có:**

Từ chỉ số authentication.log (hoặc bất kỳ sourcetype nào bạn lưu log đăng nhập), bạn cần lấy:

- user
    
- src_ip
    
- timestamp hoặc hour
    
- geoip_country
    
- success/failure (tùy chọn)


---

**C. Cách triển khai chi tiết bằng MLTK**

**Bước 1: Làm sạch dữ liệu**

```
index=security sourcetype=auth_log action=success
| eval hour=strftime(_time, "%H")
| stats count by user, src_ip, hour
```

Mục đích là gom nhóm hành vi theo từng user, src_ip, hour → từ đó học được thói quen login của từng người.

---

**Bước 2: Dùng Assistant “Detect Numeric Outliers”**

Truy cập Splunk MLTK → **Assistants → Detect Numeric Outliers**

- **Target field:** count
    
- **Split by:** user
    
- **Algorithm:** DensityFunction hoặc OneClassSVM
    
- **Training data:** Dữ liệu của 7-14 ngày trước  

> Bạn có thể chọn thuật toán như DensityFunction để tính xác suất mỗi điểm xuất hiện → điểm càng “hiếm”, xác suất càng thấp → càng bất thường.

---

**Bước 3: Kiểm tra mô hình và copy SPL**

Sau khi mô hình được huấn luyện và phát hiện các điểm outlier, bạn có thể **export SPL** như sau:

```
index=security sourcetype=auth_log action=success earliest=-24h
| eval hour=strftime(_time, "%H")
| stats count by user, src_ip, hour
| apply login_anomaly_model
| where isOutlier=1
```

- Các dòng có isOutlier=1 là những điểm hệ thống xác định là **bất thường**
    
- Bạn có thể gửi cảnh báo, hoặc enrich thêm thông tin như geoip để đưa vào case


---

**D. Gợi ý nâng cao: Phát hiện bất thường trong alert volume**

Bạn có thể dùng MLTK để:

- Dự đoán số lượng alert bình thường trong ngày
    
- Phát hiện khi số lượng alert tăng bất thường (do bị DDoS, brute force, hoặc spam log)

```
index=notable earliest=-30d
| timechart span=1h count AS alert_count
| fit ARIMA alert_count into alert_model
| apply alert_model
| where 'residual(alert_count)' > 2 * 'rmse(alert_count)'
```

→ Khi sai số dự đoán (residual) quá lớn → đây có thể là một **bùng phát cảnh báo (alert spike)** cần kiểm tra.

---

**Chốt lại kiến thức**

- **Phát hiện bất thường là ứng dụng số 1 của MLTK** trong an ninh mạng, đặc biệt với các hành vi khó mô tả bằng rule.
    
- Bạn có thể triển khai bằng cách dùng **Assistant Detect Outlier** hoặc **fit + apply** theo cách thủ công.
    
- Dữ liệu huấn luyện nên bao gồm **hành vi bình thường trong 7-30 ngày** để mô hình học được chính xác.
    
- Outlier không phải lúc nào cũng là tấn công – nhưng là một điểm **ưu tiên điều tra** trong quá trình phân tích.

---

#### **3.2. Phân loại sự kiện (Event Classification)**

**Tóm tắt nội dung**

Trong phần này, ta sẽ khám phá cách dùng MLTK để **phân loại các sự kiện bảo mật** – từ log thô, cảnh báo, đến các hành vi hệ thống – thành các nhóm như “bình thường”, “nghi ngờ”, hay “nguy hiểm”. Đây là bước nền tảng cho các hệ thống cảnh báo thông minh và tự động hóa điều tra trong SOC.

---

**A. Lý thuyết ngắn gọn**

**Phân loại (Classification)** là bài toán supervised learning (học có giám sát), tức là:

- **Dữ liệu đầu vào:** Đã có nhãn (label), ví dụ: label=malicious hoặc label=benign
    
- **Mục tiêu:** Học từ dữ liệu đã gán nhãn để phân loại sự kiện mới

**Một số thuật toán thường dùng trong MLTK:**

|**Thuật toán**|**Mô tả ngắn**|**Khi nào nên dùng**|
|---|---|---|
|**Logistic Regression**|Dự đoán nhị phân (2 nhóm)|Phân biệt sự kiện bình thường / nguy hiểm|
|**Decision Tree**|Cây quyết định dễ giải thích|Khi cần mô hình dễ đọc, dễ phân tích|
|**Naive Bayes**|Giả định độc lập giữa các feature|Khi có dữ liệu log dạng text|
|**Random Forest**|Kết hợp nhiều cây|Khi cần độ chính xác cao, dữ liệu phức tạp|

---

**B. Tình huống thực tế: Phân loại cảnh báo từ SOAR**

**Mô tả:**

SOC của bạn mỗi ngày nhận hàng trăm cảnh báo (notable events). Tuy nhiên, phần lớn là **false positive**. Bạn muốn huấn luyện một mô hình phân loại để:

- **Loại bớt cảnh báo không cần điều tra**
    
- Tự động dán nhãn “cần xử lý” hoặc “có thể bỏ qua”

**Nguồn dữ liệu cần có:**

Từ dữ liệu đã điều tra trước đây:

- src_ip, dest_ip
    
- alert_type
    
- user_agent, uri, geoip_country
    
- label: 1 nếu là sự cố thật (True Positive), 0 nếu là false positive

---

**C. Cách triển khai chi tiết bằng Splunk MLTK**

**Bước 1: Chuẩn bị dữ liệu gán nhãn**

```
index=notable label=* earliest=-30d
| table src_ip, dest_ip, alert_type, user_agent, uri, geoip_country, label
```

Lưu ý:

- Trường label là bắt buộc để huấn luyện mô hình classification
    
- Bạn cần ít nhất vài trăm dòng để mô hình học hiệu quả

---

**Bước 2: Dùng Assistant “Predict Categorical Fields”**

Truy cập: MLTK → **Assistants → Predict Categorical Fields**

- **Target field:** label
    
- **Input fields:** alert_type, src_ip, geoip_country, user_agent, …
    
- **Algorithm:** LogisticRegression, DecisionTree, hoặc RandomForest
    
- **Training size:** Tối thiểu 70-80% dữ liệu (chia train/test)

Sau khi huấn luyện, MLTK sẽ trả về:

- **Độ chính xác (accuracy)**
    
- **Ma trận nhầm lẫn (confusion matrix)**: dễ thấy mô hình có phân biệt tốt không

---

**Bước 3: Áp dụng mô hình với dữ liệu mới**

```
index=notable earliest=-1h
| table src_ip, dest_ip, alert_type, user_agent, uri, geoip_country
| apply classify_notable_model
| where predicted(label)=1
```

Giải thích:

- Chỉ hiển thị các cảnh báo được mô hình dự đoán là label=1 → tức là **“cảnh báo nghiêm trọng”**
    
- Bạn có thể tự động chuyển cảnh báo này vào playbook trong SOAR để xử lý ưu tiên

---

**D. Gợi ý nâng cao: Áp dụng cho log hệ thống, không có nhãn sẵn**

Nếu bạn không có label sẵn, bạn có thể tự tạo ra nhãn bằng cách:

- **Gán nhãn thủ công cho một tập dữ liệu nhỏ**
    
- **Dùng threat intelligence hoặc blacklist** để dán nhãn tự động (src_ip in threat_list → label=1)
    
- Sau đó, huấn luyện mô hình để mở rộng ra toàn bộ dữ liệu

---

**So sánh: Rule-based vs ML-based**

|**Tiêu chí**|**Rule-based detection**|**ML-based classification**|
|---|---|---|
|Dễ triển khai|Có|Cần chuẩn bị dữ liệu|
|Linh hoạt, học hỏi|Không|Có|
|Bắt được hành vi mới|Không|Có thể|
|Hiểu mô hình|Rất rõ (có rule)|Có thể khó hiểu (black box)|

---

**Chốt lại kiến thức**

- Phân loại sự kiện là một **ứng dụng rất mạnh của MLTK**, giúp giảm tải cho SOC và ưu tiên cảnh báo.
    
- Cần chuẩn bị dữ liệu có nhãn, nhưng một khi đã có → có thể triển khai quy trình phân loại tự động.
    
- MLTK hỗ trợ nhiều thuật toán và có giao diện Assistant giúp bạn huấn luyện dễ dàng.

---

#### **3.3. Dự đoán sự kiện / Phát hiện sớm (Forecasting / Prediction)**

**Tóm tắt nội dung**

Ở hai phần trước, ta đã học cách phát hiện bất thường và phân loại sự kiện. Trong phần này, chúng ta sẽ tìm hiểu cách **dự đoán các xu hướng an ninh có thể xảy ra** trong tương lai gần – như tăng đột biến số lượng alert, số lượng đăng nhập, hay truy cập vào các ứng dụng nhạy cảm. Đây chính là bước **chủ động ứng phó** thay vì chỉ phản ứng khi sự việc đã xảy ra.

---

**A. Lý thuyết ngắn gọn**

**Forecasting (Dự báo)** là kỹ thuật dự đoán **giá trị số trong tương lai** dựa trên dữ liệu lịch sử. Trong Splunk MLTK, có thể sử dụng các thuật toán như:

|**Thuật toán**|**Mô tả**|**Ứng dụng**|
|---|---|---|
|**Linear Regression**|Dự đoán tuyến tính đơn giản|Dự báo số lượng alert nếu xu hướng ổn định|
|**ARIMA**|Mô hình thời gian có chu kỳ|Phân tích chuỗi thời gian phức tạp (log, traffic, login…)|
|**StateSpaceForecast**|Tối ưu cho dữ liệu biến động nhiều|Dự đoán dựa trên trạng thái hệ thống|
|**Kalman Filter**|Dự báo ngắn hạn, phản ứng nhanh|Tốt cho dữ liệu thời gian thực|

---

**B. Tình huống thực tế: Dự đoán số lượng cảnh báo bảo mật**

**Mô tả:**

Giả sử mỗi ngày SOC của bạn nhận khoảng 200–300 cảnh báo (notable events). Bạn muốn:

- Dự đoán **ngày mai sẽ có bao nhiêu cảnh báo**
    
- Nếu số lượng cảnh báo dự đoán vượt ngưỡng → **tăng ca, chia trực ca**, chuẩn bị lực lượng ứng phó

---

**C. Cách triển khai chi tiết trong Splunk MLTK**

**Bước 1: Trích xuất dữ liệu chuỗi thời gian**

```
index=notable earliest=-30d
| timechart span=1d count AS daily_alerts
```

→ Lấy số lượng alert mỗi ngày trong 30 ngày gần nhất.

---

**Bước 2: Dùng Assistant “Forecast Time Series”**

Vào: MLTK → **Assistants → Forecast Time Series**

- **Target field:** daily_alerts
    
- **Algorithm:** ARIMA, StateSpaceForecast, hoặc LLP4Forecast
    
- **Forecast length:** 7 (tức là 7 ngày tới)
    
- **Train-test split:** 80/20 để kiểm tra độ chính xác

Sau khi chạy, bạn sẽ thấy:

- Đường biểu diễn thực tế và đường dự đoán
    
- Khoảng tin cậy (confidence interval)
    
- Sai số (RMSE, MAE, …)

---

**Bước 3: Dự đoán + cảnh báo nếu vượt ngưỡng**

Sau khi huấn luyện xong, bạn có thể áp dụng mô hình bằng SPL:

```
index=notable earliest=-30d
| timechart span=1d count AS daily_alerts
| apply forecast_alert_model
| where 'forecast(daily_alerts)' > 1.5 * 'mean(daily_alerts)'
```

→ Nếu dự đoán cho ngày mai vượt quá 150% trung bình 30 ngày → có thể là **đợt tấn công lớn sắp tới**

---

**D. Use case nâng cao: Dự báo số lượng đăng nhập theo giờ**

Đây là một ví dụ khác để bạn mở rộng ứng dụng:

```
index=auth_log earliest=-7d
| bin _time span=1h
| stats count AS logins by _time
| apply hourly_login_model
| where 'forecast(logins)' > 2 * 'stdev(logins)'
```

→ Dùng để phát hiện sớm khả năng brute-force hoặc đăng nhập bất thường theo giờ.

---

**So sánh nhanh: Dự đoán vs Phát hiện bất thường**

|**Đặc điểm**|**Dự đoán (Forecasting)**|**Phát hiện bất thường (Anomaly Detection)**|
|---|---|---|
|Mục tiêu|Tìm ra xu hướng tương lai|Tìm điểm bất thường trong hiện tại / quá khứ|
|Yêu cầu dữ liệu|Dữ liệu thời gian ổn định|Có hoặc không có nhãn|
|Ứng dụng|Dự báo alert, log, traffic|Phát hiện tấn công, hành vi lạ|

---

**Chốt lại kiến thức**

- Dự đoán là ứng dụng giúp SOC **chủ động** hơn trước các mối đe dọa tiềm tàng.
    
- Splunk MLTK cung cấp các mô hình chuỗi thời gian mạnh mẽ như ARIMA, Kalman, LLP4.
    
- Có thể dùng để dự đoán: số lượng alert, số lượng đăng nhập, traffic bất thường, hành vi người dùng.
    
- Kết quả dự báo có thể **gắn alert tự động** nếu vượt ngưỡng → kích hoạt SOAR playbook.

---


### **4. Quy trình sử dụng MLTK từ dữ liệu đến mô hình**

**Tóm tắt nội dung**

Ở các phần trước, chúng ta đã lần lượt đi qua các ứng dụng như phát hiện bất thường, phân loại sự kiện, dự đoán xu hướng. Trong phần này, mình sẽ tổng hợp lại thành một quy trình **chuẩn**, giúp bạn biết rõ **bắt đầu từ đâu, làm gì, và kết thúc như thế nào** khi triển khai MLTK cho một bài toán cụ thể.

---

#### **4.1. Lựa chọn dữ liệu đầu vào phù hợp**

**Câu hỏi cần trả lời:**

- Dữ liệu mình đang có đến từ đâu? (notable, auth_log, traffic_log,…)
    
- Có đủ độ sâu thời gian không? (tối thiểu 7–30 ngày cho học máy)
    
- Có nhãn (label) không? Nếu không có, cần dùng unsupervised?

**Ví dụ thực tế:**

```
index=notable earliest=-30d
| table _time, alert_type, src_ip, dest_ip, label
```

> **Ghi nhớ:** Tránh dùng dữ liệu quá “noisy” – hãy cố gắng làm rõ dữ liệu đầu vào ngay từ đầu.

---

#### **4.2. Làm sạch và xử lý dữ liệu bằng SPL**

Dữ liệu log thực tế **rất lộn xộn**, có thể bị:

- Trùng dòng (duplicate)
    
- Thiếu trường
    
- Trường định dạng sai kiểu (ví dụ: IP bị lưu là text có dấu chấm thừa)

**Công việc cần làm:**

- Dùng eval, replace, rex để xử lý format
    
- Dùng where isnotnull(...) để lọc dữ liệu lỗi
    
- Dùng stats, timechart để gom nhóm và làm gọn dữ liệu

**Ví dụ: Làm sạch log đăng nhập**

```
index=auth_log earliest=-30d
| eval hour=strftime(_time, "%H")
| where isnotnull(user) AND user!="-"
| stats count by user, hour
```

---

#### **4.3. Chọn thuật toán phù hợp**

Tùy vào bài toán:

|**Bài toán**|**Gợi ý thuật toán**|
|---|---|
|Dự đoán số lượng log|Linear Regression, ARIMA|
|Phân loại cảnh báo|Logistic Regression, Decision Tree|
|Phát hiện outlier|K-means, DensityFunction, OneClassSVM|
|Phân cụm log tương tự|DBSCAN, K-means|
|Gán nhãn tự động|Naive Bayes|

> **Lưu ý:** Trong Assistant, Splunk đã hỗ trợ bạn chọn thuật toán phù hợp – nhưng nếu muốn tuỳ biến sâu hơn, bạn nên tự viết SPL bằng fit / apply.

---

#### **4.4. Huấn luyện và đánh giá mô hình**

**Huấn luyện:**

Dùng fit SPL command hoặc Assistant để train mô hình:

```
| fit LogisticRegression label from alert_type, user_agent into "notable_classifier"
```

**Đánh giá:**

- Với classification: dùng confusion matrix, accuracy, precision, recall
    
- Với regression: dùng RMSE, MSE, R²
    
- Với forecasting: so sánh thực tế vs dự báo bằng biểu đồ

> Splunk MLTK tự động hiển thị các chỉ số này trong Assistant, bạn nên chụp lại để đưa vào tài liệu kiểm thử nội bộ.

---

#### **4.5. Lưu và sử dụng mô hình trong pipeline phân tích**

**Lưu mô hình:**

```
... | fit ... into "model_name"
```

**Áp dụng mô hình:**

```
... | apply model_name
```

Có thể dùng where isOutlier=1 hoặc where predicted(label)=1 để lọc kết quả nghi vấn.

**Tích hợp vào hệ thống:**

- Dùng kết quả phân loại/dự đoán để tạo notable event
    
- Trigger SOAR playbook khi có prediction=1
    
- Gửi cảnh báo qua Slack, Email nếu forecast vượt ngưỡng

---

**Quy trình tổng quát dạng sơ đồ**

```
[Log đầu vào] 
   ↓
[Tiền xử lý bằng SPL]
   ↓
[Huấn luyện mô hình (Assistant hoặc fit)]
   ↓
[Đánh giá & tinh chỉnh mô hình]
   ↓
[Lưu mô hình]
   ↓
[Áp dụng mô hình cho dữ liệu mới (apply)]
   ↓
[Kết quả ML đưa vào alert / dashboard / automation]
```

---

**Chốt lại kiến thức**

- Quy trình MLTK rất trực quan: từ **log → làm sạch → train → đánh giá → apply**.
    
- Giao diện Assistant giúp bạn làm nhanh, nhưng hiểu SPL sẽ giúp tùy biến sâu.
    
- Có thể kết hợp mô hình ML với alert, dashboard hoặc playbook SOAR để **tự động hóa toàn bộ chu trình SOC**.

---


### **5. Tích hợp MLTK với hệ thống AIOps**

**Tóm tắt nội dung**

Trong phần này, ta sẽ tìm hiểu cách Splunk MLTK được đưa vào quy trình AIOps (Artificial Intelligence for IT Operations) để biến một hệ thống SIEM/SOC từ **bị động phản ứng** sang **chủ động dự đoán và tự xử lý**. Mình cũng sẽ trình bày cách kết nối giữa MLTK với các nền tảng như **SOAR** để hình thành một chu trình phản hồi tự động thông minh.

---

#### **5.1. Khái niệm AIOps trong môi trường SOC**

**AIOps** là sự kết hợp giữa:

- **Dữ liệu lớn (Big Data)**
    
- **Machine Learning (Học máy)**
    
- **Tự động hóa vận hành (Automation)**

Mục tiêu: Giảm tải công việc vận hành thủ công, phát hiện sớm và phản ứng nhanh với các **sự cố hệ thống hoặc tấn công bảo mật**.

Trong SOC (Security Operation Center), AIOps giúp:

- Phân tích log và cảnh báo từ nhiều nguồn
    
- Phát hiện các mẫu hành vi mới mà rule không bắt được
    
- Đưa ra dự đoán và đề xuất phản hồi
    
- Tự động hóa xử lý cảnh báo thường gặp

---

#### **5.2. Splunk + MLTK + SOAR = Tự động hóa thông minh**

**Kiến trúc tích hợp đề xuất:**

```
[Log Hệ thống / Ứng dụng / Bảo mật]
         ↓
[Splunk Indexer]
         ↓
[MLTK] — Học mô hình hành vi bình thường
   ↓
[Apply mô hình → Dự đoán / Phân loại]
   ↓
[Tạo Notable Event (nếu có nghi vấn)]
   ↓
[SOAR Playbook xử lý tự động]
```

**Ví dụ workflow: Phát hiện + phản ứng bất thường**

1. **MLTK** phát hiện đăng nhập bất thường từ địa chỉ IP nước ngoài lúc 3h sáng
    
2. MLTK thêm flag isOutlier=1 vào sự kiện
    
3. SPL được thiết kế để:
    

```
... | where isOutlier=1 | eval urgency="high"
```

    
4. Gửi sự kiện vào **SOAR**
    
5. **SOAR playbook** tự động:
    
    - Tra cứu IP có trong Threat Intel hay không
        
    - Tạm khóa tài khoản (disable AD user)
        
    - Gửi Slack/Email tới SOC analyst
        
    

> **Hiệu quả:** Thời gian phản hồi giảm từ vài giờ → vài giây

---

#### **5.3. Case Study: Giảm cảnh báo giả bằng học không giám sát**

**Vấn đề:**

SOC có hàng ngàn alert mỗi ngày, nhưng >80% là **false positive**

→ Analyst mất thời gian điều tra những cảnh báo không quan trọng

**Giải pháp:**

Sử dụng mô hình **K-means clustering** để **nhóm các loại alert thường gặp** → từ đó phát hiện được những alert “lẻ”, bất thường

**Quy trình cụ thể:**

```
index=notable earliest=-30d
| stats count by src_ip, alert_type, geoip_country
| fit KMeans k=5 into alert_clusters
```

→ Các alert sẽ được gán vào cluster_id

```
index=notable earliest=-1d
| apply alert_clusters
| where cluster_id=“unknown” → flag nghi vấn
```

→ Từ đó chỉ điều tra các alert rơi vào cluster chưa từng thấy

**Kết quả:**

- Giảm 60–70% số alert analyst cần xem tay
    
- Có thể huấn luyện lại mô hình mỗi tuần/tháng để cập nhật hành vi mới

---

**Tích hợp với dashboard và automation**

- Tích hợp kết quả dự đoán từ MLTK vào dashboard SOC, ví dụ:
    
    - Top 10 IP nghi vấn
        
    - Biểu đồ số cảnh báo dự đoán 7 ngày tới
        
    - Phân loại các alert cần ưu tiên cao
    
- Trigger automation từ kết quả apply:
    
    - Tự động gửi vào Slack khi predicted(label)=1
        
    - Gọi API khóa IP / vô hiệu hóa tài khoản nếu isOutlier=1

---

**Chốt lại kiến thức**

- Splunk MLTK không chỉ để phân tích, mà là nền tảng giúp **tự động hóa SOC thông minh**.
- Khi kết hợp với SOAR, bạn có thể **biến kết quả phân tích ML thành hành động cụ thể**
- Những gì trước đây analyst phải làm bằng tay, giờ có thể **diễn ra trong vài giây** nếu tích hợp tốt.


---


### **6. Best practices và lưu ý khi triển khai Splunk MLTK**

**Tóm tắt nội dung**

Triển khai MLTK không chỉ là chuyện “chạy được mô hình”. Để thực sự hữu ích trong môi trường an ninh mạng, bạn cần tránh các lỗi phổ biến, hiểu rõ dữ liệu của mình và biết cách bảo trì, cập nhật mô hình lâu dài. Phần này sẽ giúp bạn tránh “vỡ trận” khi đi từ PoC (thử nghiệm) sang production (triển khai thật).

---

#### **6.1. Những sai lầm phổ biến cần tránh**

|**Sai lầm**|**Hệ quả**|**Giải pháp**|
|---|---|---|
|**Huấn luyện với dữ liệu lỗi hoặc thiếu xử lý**|Mô hình học sai, dự đoán sai|Luôn làm sạch dữ liệu kỹ trước khi huấn luyện|
|**Dữ liệu train không đại diện cho thực tế**|Mô hình không áp dụng được khi gặp tình huống mới|Dùng dữ liệu đa dạng, đủ thời gian, không chỉ “góc nhìn đẹp”|
|**Không đánh giá mô hình đầy đủ**|Khó biết mô hình tốt hay tệ|Luôn test trên dữ liệu mới, so sánh accuracy, confusion matrix|
|**Dùng mô hình không phù hợp với bài toán**|Kết quả sai lệch hoặc kém hiệu quả|Chọn thuật toán phù hợp: classification hay clustering? supervised hay không?|
|**Huấn luyện một lần rồi quên luôn**|Mô hình lỗi thời, không còn đúng nữa|Cần tái huấn luyện định kỳ theo chu kỳ dữ liệu thay đổi|

**Gợi ý thực tế:**

- Với dữ liệu đăng nhập, hãy huấn luyện theo từng user, không nên gom hết vào một mô hình chung.
    
- Với alert volume, tránh dùng dữ liệu dịp lễ tết để train vì có thể gây nhiễu.

---

#### **6.2. Hiểu rõ mục tiêu và dữ liệu của mình**

**Đừng bắt đầu bằng mô hình – hãy bắt đầu bằng câu hỏi:**

> “Tôi đang cố gắng giải quyết vấn đề gì trong SOC của mình?”

Ví dụ:

- Bạn đang muốn **giảm false positive**?
    
- Bạn muốn **phát hiện các hành vi chưa từng thấy**?
    
- Hay muốn **dự đoán số lượng log để phân bổ nhân sự**?

**Sau đó mới chọn dữ liệu và mô hình phù hợp.**

|**Mục tiêu**|**Kiểu dữ liệu cần**|**Mô hình phù hợp**|
|---|---|---|
|Phát hiện login bất thường|Log đăng nhập, IP, giờ, thiết bị|Anomaly detection|
|Phân loại alert|Dữ liệu cảnh báo đã dán nhãn|Classification|
|Dự báo số lượng alert|Time-series alert volume|Forecasting|
|Gán nhãn cho log thô|Dữ liệu text hoặc IP + label|Supervised learning|

> **Tips:** Hãy vẽ sơ đồ đơn giản (input → xử lý → output mong muốn) trước khi bắt tay vào xây mô hình.

---

#### **6.3. Lưu trữ, bảo trì và cập nhật mô hình ML**

**Lưu trữ mô hình đúng cách**

- Tất cả mô hình sau khi fit được lưu tại:

```
$SPLUNK_HOME/var/lib/splunk/modinput/mltk/models/
```
    
- Có thể xem quản lý mô hình bằng giao diện **Model Management** trong MLTK App
    

**Đặt tên mô hình rõ ràng**

- Đặt tên theo cấu trúc:
    
    `type_usecase_scope_version`, ví dụ:
    
    `clf_notable_ipgroup_v1`, `forecast_login_perhour_v2`
  
**Tái huấn luyện mô hình định kỳ**

|**Tình huống**|**Chu kỳ tái huấn luyện đề xuất**|
|---|---|
|Dữ liệu thay đổi liên tục (login, alert)|1 tuần / lần|
|Hành vi ổn định (user-agent, cluster IP)|1 tháng / lần|
|Mô hình phục vụ audit / báo cáo|Theo kỳ báo cáo|

**Cách thực hiện lại huấn luyện:**

- Dùng lại fit command với dữ liệu mới
    
- Có thể viết SPL định kỳ chạy trên cron schedule (kết hợp alert hoặc playbook để tự động)

```
index=auth_log earliest=-7d
| ... xử lý dữ liệu ...
| fit LogisticRegression label from ... into login_classifier_v2
```

> Có thể thêm điều kiện: chỉ train lại nếu số lượng log > N dòng, hoặc nếu sai số vượt ngưỡng.

---

**Chốt lại kiến thức**

- Hãy tránh “chạy mô hình để cho có”. Một mô hình hiệu quả phải: dữ liệu đúng → thuật toán đúng → mục tiêu rõ ràng.
    
- Coi việc **bảo trì mô hình giống như bảo trì hệ thống SIEM** – nếu không sẽ sớm trở nên lỗi thời hoặc sai lệch.
    
- Tích hợp việc train/apply lại mô hình vào quy trình SOC hàng tuần/tháng là điều cần thiết nếu muốn vận hành ổn định.

---

Dưới đây là nội dung chi tiết cho **Phần 7: Tài nguyên học tập & hướng phát triển nâng cao** – phần kết thúc của bài blog, dành cho bạn nào muốn đi xa hơn với Splunk Machine Learning Toolkit (MLTK), trở thành **chuyên gia phân tích và triển khai ML trong môi trường bảo mật thực thụ**.

---

### **7. Tài nguyên học tập & hướng phát triển nâng cao**

**Tóm tắt nội dung**

Splunk MLTK rất dễ tiếp cận với giao diện trực quan, nhưng để sử dụng chuyên sâu và mở rộng khả năng phân tích trong SOC, bạn nên biết thêm về:

- Tài liệu chính thức
    
- Khóa học thực hành
    
- Cách tùy biến MLTK nâng cao bằng Python, SDK

---

#### **7.1. Các nguồn tài liệu chính thức từ Splunk**

**Trang Splunk MLTK Documentation**

- Địa chỉ: https://docs.splunk.com/Documentation/MLApp
    
- Đây là tài liệu **chính thống và cập nhật nhất**, bao gồm:
    
    - Hướng dẫn cài đặt
        
    - Danh sách các thuật toán hỗ trợ
        
    - Cách sử dụng SPL với fit, apply, score
        
    - Các use case mẫu và cấu trúc dữ liệu

**Splunkbase – App Splunk Machine Learning Toolkit**

- https://splunkbase.splunk.com/app/2890
    
- Tải bản mới nhất của MLTK
    
- Đọc đánh giá từ cộng đồng, cập nhật lỗi & tính năng mới    

**Splunk Lantern (Guided Learning)**

- https://lantern.splunk.com
    
- Tìm các hướng dẫn theo từng vai trò: SOC analyst, security engineer, machine learning engineer
    
- Có bài viết mẫu cho từng use case: anomaly detection, alert classification, traffic prediction,…

---

#### **7.2. Khóa học, lab thực hành & cộng đồng Splunk MLTK**

**Splunk Education – Machine Learning with Splunk**

- Khóa học chính thức của Splunk University (dành cho người học chuyên sâu)
    
- Thời lượng: 3 ngày (online hoặc onsite)
    
- Nội dung:
    
    - Xây dựng mô hình ML từ log thực
        
    - Kết hợp MLTK với SPL và dashboard
        
    - Case study ứng dụng trong IT và bảo mật

> **Gợi ý:** Có thể xin tài khoản Trial hoặc yêu cầu tài liệu nếu tổ chức chưa có license học

---

**TrySplunk: Lab thực hành online miễn phí**

- https://www.splunk.com/en_us/resources/try-splunk.html
    
- Có sandbox MLTK để thực hành mà không cần cài đặt
    
- Một số lab điển hình:
    
    - Forecast traffic
        
    - Detect outliers in login patterns
        
    - Predict server failures

---

**Cộng đồng Splunk (Community + Forum)**

- **Splunk Answers:** https://community.splunk.com
    
- **Reddit:** r/Splunk
    
- **Slack Group Splunk User Group**: Rất nhiều chuyên gia từ các doanh nghiệp lớn chia sẻ cách dùng MLTK để giảm alert, dự đoán log, và kết nối với SOAR

---

#### **7.3. Hướng đi nâng cao: Tùy biến MLTK bằng Python và SDK**

Nếu bạn muốn làm được những điều vượt ngoài giao diện Assistant, bạn có thể:

**A. Viết mô hình riêng bằng Python (Custom Algorithm)**

- MLTK hỗ trợ import các thuật toán ML từ Python (scikit-learn, xgboost, v.v.)
    
- Bạn có thể tạo 1 mô hình Python theo định dạng chuẩn của Splunk:
    
    - `fit()` và `predict()` functions
        
    - Đặt trong bin/algorithms và khai báo trong algos.conf

> Ví dụ: Viết mô hình phát hiện IP scan bằng Isolation Forest rồi gắn vào MLTK

---

**B. Dùng Splunk SDK để quản lý mô hình qua API**

- Splunk SDK for Python: https://dev.splunk.com/enterprise/docs/python/sdk-python
    
- Có thể:
    
    - Lấy dữ liệu từ index để huấn luyện bên ngoài Splunk
        
    - Gửi kết quả dự đoán trở lại Splunk để visualize hoặc trigger playbook
        
    - Xây dựng ML pipeline tùy biến theo thời gian thực

---

**C. Tích hợp MLTK với hệ thống ngoài (Kafka, Delta Lake, etc.)**

- Một số doanh nghiệp dùng **Splunk chỉ để visualize kết quả ML** huấn luyện từ Spark MLlib hoặc Data Lake khác
    
- Khi đó, bạn có thể:
    
    - Huấn luyện mô hình trong hệ thống ngoài
        
    - Export ra CSV hoặc dùng REST API đẩy về Splunk
        
    - Apply trực tiếp bằng lookup hoặc inputlookup + apply

---

**Chốt lại kiến thức**

- Splunk cung cấp rất nhiều tài liệu và công cụ học tập miễn phí để nâng cao kỹ năng với MLTK.
    
- Nếu muốn trở thành **Splunk ML Engineer**, bạn nên tìm hiểu cách viết mô hình bằng Python và kết nối SDK.
    
- Mục tiêu cuối cùng là **tự động hóa và làm thông minh hóa toàn bộ quá trình phân tích và phản ứng bảo mật**.


