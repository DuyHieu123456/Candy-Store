import { useState } from "react";
import Button from "../../components/Button/Button";

const PAYMENT_METHODS = [
  { id: "cod",         label: "💵 Thanh toán khi nhận hàng", desc: "COD - Trả tiền mặt khi nhận"         },
  { id: "momo",        label: "💜 Ví MoMo",                  desc: "Quét QR hoặc số điện thoại MoMo"      },
  { id: "zalopay",     label: "🔵 ZaloPay",                  desc: "Thanh toán qua ví ZaloPay"             },
  { id: "visa",        label: "💳 VISA",                     desc: "Thẻ tín dụng / ghi nợ VISA"           },
  { id: "mastercard",  label: "💳 Mastercard",               desc: "Thẻ tín dụng / ghi nợ Mastercard"     },
];

const CheckoutForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    fullName:   "",
    phone:      "",
    email:      "",
    province:   "",
    district:   "",
    address:    "",
    note:       "",
    payment:    "cod",
  });

  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())  errs.fullName = "Vui lòng nhập họ tên";
    if (!form.phone.trim())     errs.phone    = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)\d{9}$/.test(form.phone.replace(/\s/g, "")))
                                errs.phone    = "Số điện thoại không hợp lệ";
    if (!form.province.trim())  errs.province = "Vui lòng nhập tỉnh/thành phố";
    if (!form.district.trim())  errs.district = "Vui lòng nhập quận/huyện";
    if (!form.address.trim())   errs.address  = "Vui lòng nhập địa chỉ cụ thể";
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
          <label className="checkout-form__label">
            Họ và tên <span>*</span>
          </label>
          <input
            className={`checkout-form__input ${errors.fullName ? "checkout-form__input--error" : ""}`}
            name="fullName"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={change}
          />
          {errors.fullName && <p className="checkout-form__error">{errors.fullName}</p>}
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Số điện thoại <span>*</span>
          </label>
          <input
            className={`checkout-form__input ${errors.phone ? "checkout-form__input--error" : ""}`}
            name="phone"
            placeholder="0901234567"
            value={form.phone}
            onChange={change}
          />
          {errors.phone && <p className="checkout-form__error">{errors.phone}</p>}
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">Email</label>
          <input
            className="checkout-form__input"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={change}
          />
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Tỉnh / Thành phố <span>*</span>
          </label>
          <input
            className={`checkout-form__input ${errors.province ? "checkout-form__input--error" : ""}`}
            name="province"
            placeholder="TP. Hồ Chí Minh"
            value={form.province}
            onChange={change}
          />
          {errors.province && <p className="checkout-form__error">{errors.province}</p>}
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Quận / Huyện <span>*</span>
          </label>
          <input
            className={`checkout-form__input ${errors.district ? "checkout-form__input--error" : ""}`}
            name="district"
            placeholder="Quận 1"
            value={form.district}
            onChange={change}
          />
          {errors.district && <p className="checkout-form__error">{errors.district}</p>}
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Địa chỉ cụ thể <span>*</span>
          </label>
          <input
            className={`checkout-form__input ${errors.address ? "checkout-form__input--error" : ""}`}
            name="address"
            placeholder="Số nhà, tên đường, phường..."
            value={form.address}
            onChange={change}
          />
          {errors.address && <p className="checkout-form__error">{errors.address}</p>}
        </div>

        <div className="checkout-form__field checkout-form__grid--full">
          <label className="checkout-form__label">Ghi chú đơn hàng</label>
          <textarea
            className="checkout-form__textarea"
            name="note"
            placeholder="Ghi chú cho người giao hàng (nếu có)..."
            value={form.note}
            onChange={change}
          />
        </div>
      </div>

      <h3 className="checkout-form__section-title" style={{ marginTop: 28 }}>
        💳 Phương Thức Thanh Toán
      </h3>

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

      <Button
        type="submit"
        size="lg"
        fullWidth
        className="checkout-form__submit"
        disabled={loading}
      >
        {loading ? "⏳ Đang xử lý..." : "✅ Xác Nhận Đặt Hàng"}
      </Button>
    </form>
  );
};

export default CheckoutForm;