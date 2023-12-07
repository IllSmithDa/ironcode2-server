const { Language } = require("../models/Language");

const postLanguage = async (req, res) => {
  const { name, description} = req.body;
  try {
    const response = await Language.createLanguage(name, description)
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

const getAllLanguages = async (req, res) => {
  try {
    const response = await Language.getAllLanguages();
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

const getLanguageById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await Language.getLanguageById(id);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

const updateLanguage = async (req, res) => {
  try {
    const {id, name, description} = req.body;
    const response = await Language.updateLanguage(id, name, description);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

const deleteLanguageById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await Language.deleteLanguageById(id);
    if (response.success) {
      res.status(200).json({ success: true, data: response.data  })
    }
  } catch (err) {
    res.status(401).json({ err: (err ).message })
  }
}

module.exports = {
  postLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguageById
}