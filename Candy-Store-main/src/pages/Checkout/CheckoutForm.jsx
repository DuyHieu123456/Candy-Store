import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/Button/Button";

const PAYMENT_METHODS = [
  { id: "cod", label: "💵 Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt khi Shipper giao kẹo" },
  { id: "momo", label: "💜 Ví MoMo", desc: "Thanh toán nhanh qua ứng dụng MoMo" },
  { id: "vnpay", label: "💳 VNPay", desc: "Thanh toán qua thẻ ATM hoặc QR code" },
];

const CheckoutForm = ({ onSubmit, loading }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    province: "",
    district: "",
    address: "",
    note: "",
    payment: "cod",
  });

  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Bạn chưa nhập họ tên";
    if (!form.phone.trim()) errs.phone = "Số điện thoại là bắt buộc";
    else if (!/^(0|\+84)\d{9}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Số điện thoại không đúng định dạng";
    if (!form.address.trim()) errs.address = "Vui lòng cho biết địa chỉ nhận kẹo";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h3 className="checkout-form__section-title">📦 Thông Tin Giao Hàng</h3>
      <div className="checkout-form__grid">
        <div className="checkout-form__field">
          <label className="checkout-form__label">Họ và tên <span>*</span></label>
          <input
            className={`checkout-form__input ${errors.fullName ? "checkout-form__input--error" : ""}`}
            name="fullName"
            value={form.fullName}
            onChange={change}
          />
          {errors.fullName && <p className="checkout-form__error">{errors.fullName}</p>}
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">Số điện thoại <span>*</span></label>
          <input
            className={`checkout-form__input ${errors.phone ? "checkout-form__input--error" : ""}`}
            name="phone"
            value={form.phone}
            onChange={change}
          />
          {errors.phone && <p className="checkout-form__error">{errors.phone}</p>}
        </div>

        <div className="checkout-form__field checkout-form__grid--full">
          <label className="checkout-form__label">Địa chỉ cụ thể <span>*</span></label>
          <input
            className={`checkout-form__input ${errors.address ? "checkout-form__input--error" : ""}`}
            name="address"
            placeholder="Số nhà, tên đường, phường/xã..."
            value={form.address}
            onChange={change}
          />
          {errors.address && <p className="checkout-form__error">{errors.address}</p>}
        </div>

        <div className="checkout-form__field checkout-form__grid--full">
          <label className="checkout-form__label">Ghi chú</label>
          <textarea
            className="checkout-form__textarea"
            name="note"
            value={form.note}
            onChange={change}
          />
        </div>
      </div>

      <h3 className="checkout-form__section-title" style={{ marginTop: 28 }}>💳 Thanh Toán</h3>
      <div className="checkout-form__payments">
        {PAYMENT_METHODS.map((pm) => (
          <label key={pm.id} className="checkout-form__pay-option">
            <input
              type="radio"
              name="payment"
              value={pm.id}
              checked={form.payment === pm.id}
              onChange={change}
            />
            <div>
              <p className="checkout-form__pay-label">{pm.label}</p>
              <p className="checkout-form__pay-desc">{pm.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <Button type="submit" size="lg" fullWidth className="checkout-form__submit" disabled={loading}>
        {loading ? "⏳ Đang gửi đơn..." : "✅ Xác Nhận Đặt Hàng"}
      </Button>
    </form>
  );
};

export default CheckoutForm;