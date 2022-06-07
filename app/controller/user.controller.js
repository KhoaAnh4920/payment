"use strict";

/**
 * user.controller.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */
const jsonFormat = require("../jsonHelper/jsonFormat");
const userService = require("../service/user.service");
/**
 * API end calling
 * @returns {Promise<void>}
 */
exports.getMomoPaymentLink = async (req, res) => {
  try {
    const result = await userService.getMomoPaymentLink(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Get Link successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

exports.printCodeShipping = async (req, res) => {
  try {
    const result = await userService.printCodeShipping(req, res);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Get Code successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

exports.cancelCodeShipping = async (req, res) => {
  try {
    const result = await userService.cancelCodeShipping(req, res);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Cancel successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};


/**
 * API update creator
 * @returns {Promise<void>}
 */
exports.handleOrderPayment = async (req, res) => {
  try {
    const result = await userService.handleOrderPayment(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Handle payment successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

/**
 * API update creator
 * @returns {Promise<void>}
 */
exports.handleCallbackOrderStatus = async (req, res) => {
  try {
    console.log(req.body);
    const result = await userService.handleCallbackOrderStatus(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Handle payment successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

/**
 * API update creator
 * @returns {Promise<void>}
 */
exports.getListStatusByOrderIds = async (req, res) => {
  try {
    const result = await userService.getListStatusByOrderIds(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Handle list successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

/**
 * API update creator
 * @returns {Promise<void>}
 */
exports.handleCreateOrderShipping = async (req, res) => {
  try {
    console.log(req.body);
    const result = await userService.handleCreateOrderShipping(req);
    if (!result.success)
      return res
        .status(400)
        .json(
          jsonFormat.dataError(
            result.message
              ? result.message
              : "Somethings gone wrong, please try again or contact Admin if the issue persists."
          )
        );
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Handle payment successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

exports.getDashboards = async (req, res) => {
  try {
    console.log("OK");
    const result = await userService.getDashboards(req);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Get dashboard successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};

exports.updateNumberOfAccess = async (req, res) => {
  try {
    const result = await userService.updateNumberOfAccess(req, res);
    return res
      .status(200)
      .json(jsonFormat.dataSuccess("Update successfully", result));
  } catch (e) {
    return res
      .status(400)
      .json(
        jsonFormat.dataError(
          e.message
            ? e.message
            : "Somethings gone wrong, please try again or contact Admin if the issue persists."
        )
      );
  }
};
