const { getAllTests, getAllPackages } = require('../utils/db');

exports.getTests = async (req, res, next) => {
  try {
    const tests = getAllTests();
    res.json(tests);
  } catch (err) { next(err); }
};

exports.getPackages = async (req, res, next) => {
  try {
    const pkgs = getAllPackages();
    res.json(pkgs);
  } catch (err) { next(err); }
};