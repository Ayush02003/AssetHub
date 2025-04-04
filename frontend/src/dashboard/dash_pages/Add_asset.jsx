import { useState, useEffect } from "react";
import "../../css/add_asset.css";
import use_addAsset from "../../hooks/UseAddAsset.js";
import axios from "axios";
import toast from "react-hot-toast";
const Add_asset = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [serial_num, setSerialNum] = useState("");
  const [price, setPrice] = useState("");
  let [other_desc, setOtherDesc] = useState("");
  const [brand, setBrand] = useState("");
  const [purchase_date, setPurchase_date] = useState("");
  const [warranty_exp, setWarranty_exp] = useState("");
  const [pic1, setPic1] = useState(null);
  const [pic2, setPic2] = useState(null);
  const [previewPic1, setPreviewPic1] = useState(null);
  const [previewPic2, setPreviewPic2] = useState(null);
  const { loading, add_asset } = use_addAsset();
  const [asset_types, setassetType] = useState([]);

  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  // const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get("/api/company/get_assetType");
        setassetType(res.data.assetTypes);
      } catch (error) {
        console.error("Error fetching asset types:", error);
        toast.error(error.message);
      }
    };
    fetchAsset();
  }, []);

  useEffect(() => {
    if (type) {
      const selectedType = asset_types.find((asset) => asset.type === type);
      if (selectedType && selectedType.fields) {
        setFields(selectedType.fields);
      }
    }
  }, [type]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pic1 || !pic2) {
      toast("Please upload both images.", {
        icon: "⚠️",
        style: {
          border: "1px solid #FFA500",
          backgroundColor: "#FFF3CD",
          color: "#856404",
        },
      });
      return;
    }
    let formattedDesc = Object.entries(fieldValues)
      .map(([key, value]) => `${key} - ${value}`)
      .join(", ");
    if (other_desc.trim()) {
      formattedDesc += formattedDesc
        ? `, Other Details - ${other_desc}`
        : `Other Details - ${other_desc}`;
    }
    await add_asset(
      name,
      type,
      serial_num,
      price,
      formattedDesc,
      brand,
      purchase_date,
      warranty_exp,
      pic1,
      pic2
    );
    setName("");
    setType("");
    setOtherDesc("");
    setPrice("");
    setBrand("");
    setPurchase_date("");
    setWarranty_exp("");
    setSerialNum("");
    setFieldValues({});
    document.getElementById("pic1Input").value = "";
    document.getElementById("pic2Input").value = "";
    setPic1(null);
    setPic2(null);
    setPreviewPic1(null);
    setPreviewPic2(null);
  };
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const iconMapping = {
    ram: "fa-solid fa-memory",
    storage: "fa-solid fa-hdd",
    processor: "fa-solid fa-microchip",
    graphics: "fa-solid fa-video",
    screen: "fa-solid fa-desktop",
    resolution: "fa-solid fa-tv",
    weight: "fa-solid fa-weight-hanging",
    battery: "fa-solid fa-battery-full",
    camera: "fa-solid fa-camera",
    ports: "fa-solid fa-plug",
  };

  return (
    <div>
      <div className="asset_main">
        <h2>ADD ASSET</h2>
        <div className="asset_form">
          <div className="asset-upper-part">
            <h4>Assset Information</h4>
          </div>
          <div className="asset-lower-part">
            <form action="" onSubmit={handleSubmit}>
              <table>
                <tr>
                  <td>
                    <label htmlFor="type">Type</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-desktop"></i>
                    <select
                      required
                      name="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Asset Type
                      </option>
                      {asset_types
                        .filter(
                          (asset_type) =>
                            asset_type.status.toLowerCase() != "inactive"
                        )
                        .map((asset_type) => (
                          <option key={asset_type._id} value={asset_type.type}>
                            {asset_type.type}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label htmlFor="">Name</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-regular fa-user"></i>
                    <input
                      required
                      type="text"
                      name="name"
                      id=""
                      placeholder="Enter asset name (e.g., Asus Vivobook, Printer)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label htmlFor="">Price</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa fa-inr"></i>
                    <input
                      required
                      min="1"
                      placeholder="Enter asset price"
                      type="number"
                      name="price"
                      id=""
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Description</label>
                  </td>
                </tr>

                {fields.map((field, index) => {
                  const FieldName = field.toLowerCase();
                  return (
                    <tr key={index}>
                      <td>
                        <i
                          className={
                            iconMapping[FieldName] || "fa-solid fa-cogs"
                          }
                        ></i>
                        <input
                          required
                          type="text"
                          name={field}
                          placeholder={`Enter ${field}`}
                          value={fieldValues[field] || ""}
                          onChange={(e) =>
                            setFieldValues({
                              ...fieldValues,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}

                <tr>
                  <td>
                    <i className="fa fa-info-circle"></i>
                    <input
                      placeholder="Any Other detail "
                      type="text"
                      name="other_desc"
                      id=""
                      value={other_desc}
                      onChange={(e) => setOtherDesc(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Serail Num</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa fa-list-ol"></i>
                    <input
                      required
                      type="string"
                      name="serial_num"
                      min="1"
                      placeholder="Enter serial num of asset"
                      value={serial_num}
                      onChange={(e) => setSerialNum(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Brand</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-tag"></i>
                    <input
                      placeholder="Enter brand name (e.g.,Asus, Apple)"
                      required
                      type="text"
                      name="brand"
                      id=""
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Purchase Date</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i className="fa-solid fa-calendar-days"></i>
                    <input
                      required
                      type="date"
                      name="purchase_date"
                      id=""
                      value={purchase_date}
                      onChange={(e) => setPurchase_date(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Warrany Expiry</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      className="fa-solid fa-hourglass-start"
                      onClick={() =>
                        document.getElementById("warranty").click()
                      }
                    ></i>
                    <input
                      required
                      min={purchase_date}
                      type="date"
                      id="warranty"
                      name="warranty_expiry"
                      value={warranty_exp}
                      onChange={(e) => setWarranty_exp(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Pics</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      style={{ fontSize: "22px" }}
                      className="fa-regular fa-image"
                    ></i>
                    <input
                      type="file"
                      name="pic1"
                      id="pic1Input"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) =>
                        handleFileChange(e, setPic1, setPreviewPic1)
                      }
                    />
                    {previewPic1 && (
                      <img src={previewPic1} alt="Preview 1" width="100" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <i
                      style={{ fontSize: "22px" }}
                      className="fa-regular fa-image"
                    ></i>
                    <input
                      type="file"
                      name="pic2"
                      id="pic2Input"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) =>
                        handleFileChange(e, setPic2, setPreviewPic2)
                      }
                    />
                    {previewPic2 && (
                      <img src={previewPic2} alt="Preview 2" width="100" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="button">
                    <button className="submit" type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Add Asset"
                      )}
                    </button>

                    <input
                      className="reset"
                      type="reset"
                      value="Cancel"
                      onClick={() => {
                        setName("");
                        setType("");
                        setOtherDesc("");
                        setBrand("");
                        setPurchase_date("");
                        setWarranty_exp("");
                        setPic1(null);
                        setPic2(null);
                        setPreviewPic1(null);
                        setPreviewPic2(null);
                      }}
                    />
                  </td>
                </tr>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_asset;
