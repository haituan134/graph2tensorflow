# Design flow app

Giao diện chia thành 3 cột 
 - Cột bên trái bao gồm những layer có sẵn
 - Cột ở giữa để kéo thả nối các layer lại với nhau
 - Cột bên phải là là chỉnh attribute cho các layer

### 1. Cột bên trái
Trong file data.json có tập hợp tất cả các layer được hỗ trợ, đọc nó lên và hiển thị. 

### 2. Cột ở giữa
Khi kéo một layer ở cột trái (class) thì ta tạo một instance hiển thị ở cột ở giữa với thêm 1 trường trong config là name = nameClass + id.


### 3. Cột bên phải
Khi click một instance ở cột ở giữa thì sẽ hiện attribute của instance đó bên cột bên phải. 

Sẽ cho thay đổi giá trị các trường của intance có các loại: 
- Giá trị là true/false -- cho thay đổi false/true
- Giá trị là một số -- cho thay đổi giá trị của số đó ( > 0)
- Giá trị là một class (initializer, regularizer, constraint) thì cho chọn từ danh sách tên có trong attribute (không cho chỉnh config những của những cái này chỉ chọn tên thôi).
- Activationt thì không có config chỉ cho chọn các tên trong danh sách ở attribute.
- Cái khác nhất là batch_input_shape của InputLayer là  một dãy số cách nhau bằng dấu cách rồi nhét vào.



### 4. Cấu trúc lưu model 

Có hai dạng lưu model: 
- Sequential (sequential.json) là một layer chỉ nhận duy nhất một giá trị đầu vào (là giá trị output của layer nằm ngay trước nó).

- Functional (functional.json) là một layer có thể nhận nhiều giá trị đầu vào (layer add (không cần tính thứ tụ), concatenate (cần tính thứ tự)) do đó trong instance của layer thêm hai trường nữa 
    - name (duplicate trong config của instance đó)
    - inbound_nodes: liệt kê name của các instance mà class này nhận giá trị đầu vào theo lần lượt.

Trong sequential thì mặc định là intance đầu tiền là input và intance cuối cùng là output. 

Trong khi đó Functional thì có thể nhận nhiều input đầu vào và nhiều input đầu ra của cả model nên phải xác định thêm những layer nào là input và output. (Thêm hai trường input_layer và output_layers). Các inputlayer được xác định là những instance class "InputLayer" còn những output là những layers có output không là input của instance class nào cả (thật tế có thể là bất kì output của class nào nhưng assume như vậy đã)







