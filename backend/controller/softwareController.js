import Software from "../models/softwareModel.js";

export const addSoftware = async (req, res) => {
  try {
    const {
      installation_type,
      assigned_laptop_id,
      name,
      version,
      license_type,
      license_key,
      expiration_date,
      installed_by,
    } = req.body;

    if (
      !installation_type ||
      !assigned_laptop_id ||
      !name ||
      !version ||
      !license_type
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    if (
      (license_type === "Paid" || license_type === "Trial") &&
      (!license_key || !expiration_date)
    ) {
      return res
        .status(400)
        .json({
          error:
            "License Key and Expiration Date are required for Paid or Trial licenses.",
        });
    }

    const newSoftware = new Software({
      installation_type,
      assigned_laptop_id,
      name,
      version,
      license_type,
      license_key: license_type === "Free" ? null : license_key,
      expiration_date: license_type === "Free" ? null : expiration_date,
      installed_by,
    });

    await newSoftware.save();

    return res
      .status(201)
      .json({ message: "Software added successfully", software: newSoftware });
  } catch (error) {
    console.error("Error in addSoftware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSoftware = async(req,res) =>{
try {
  
  const {asset_id} = req.query    
  const softwares = await Software.find({assigned_laptop_id : asset_id})
  res.status(200).json({software : softwares});
} catch (error) {
  console.error("Error in addSoftware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
}

}
