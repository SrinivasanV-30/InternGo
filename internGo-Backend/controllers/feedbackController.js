import { createFeedback, getFeedbackByInteraction, getFeedbackByIntern, updateFeedback, deleteFeedback, calculateAvgRating } from "../models/feedbackModel.js";
import sendResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { updateInteractions } from "../models/interactionModel.js";
import { zoneCalculation } from "../utils/zoneCalculation.js";
import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { findUserByUserId } from "../models/userModel.js";

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

export const addFeedback = async (req, res) => {
    try {
        const feedbackData = req.body;
        const avgRatings = calculateAvgRating(feedbackData.ratings);
        feedbackData.avg_rating = avgRatings;
        const createdFeedback = await createFeedback(feedbackData);
        await updateInteractions(feedbackData.interactionId, { interactionStatus: "COMPLETED" })
        logger.info("Feedback added successfully");
        sendResponse(res, 201, "Feedback added successfully", createdFeedback);
        zoneCalculation(feedbackData.internId);
    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getFeedbacksByInteraction = async (req, res) => {
    try {
        const interactionId = parseInt(req.params.interactionId);
        const feedback = await getFeedbackByInteraction(interactionId);
        if (feedback.length == 0) {
            return sendResponse(res, 200, "No feedback found", []);
        }
        logger.info("Fetched feedback successfully");
        sendResponse(res, 200, "Fetched feedback successfully", feedback);
    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getFeedbacksByIntern = async (req, res) => {
    try {
        const internId = req.params.internId;
        const feedback = await getFeedbackByIntern(internId);
        if (feedback.length == 0) {
            return sendResponse(res, 200, "No feedback found", []);
        }
        logger.info("Fetched feedback successfully");
        sendResponse(res, 200, "Fetched feedback successfully", feedback);
    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const modifyFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedData = req.body;

        const updatedFeedback = await updateFeedback(id, updatedData);
        logger.info("Feedback updated successfully");
        sendResponse(res, 200, "Feedback updated successfully", updatedFeedback);
        zoneCalculation(feedbackData.internId);
    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const removeFeedback = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteFeedback(id);
        logger.info("Feedback deleted successfully");
        sendResponse(res, 200, "Feedback deleted successfully");
    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const generateFeedbackReport = async (req, res) => {
    try {
        const internId = req.params.id;
        const internDetail = await findUserByUserId(internId);
        const feedbacks = await getFeedbackByIntern(internId);
        if (feedbacks.length == 0) {
            return sendResponse(res, 200, "No feedback found", []);
        }
        // console.log(feedbacks)
        const descriptiveFeedbacks = feedbacks.map((feedback) => feedback.descriptive_feedback).join(" ")
        const feedbackSummary = await axios.post("https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn", { inputs: descriptiveFeedbacks },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.HF_ACCESS_KEY}`
                }
            }
        );
        // console.log(feedbackSummary)
        const avgRatings = {};
        let avgCount = {}
        feedbacks.forEach(feedback => {
            Object.keys(feedback.ratings).forEach(key => {
                const standardizedKey = key.toLowerCase().trim();
                const capitalizedKey = standardizedKey
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                if (!avgRatings[capitalizedKey]) {
                    avgRatings[capitalizedKey] = feedback.ratings[key];
                    avgCount[capitalizedKey] = 1
                    console.log(key);
                } else {
                    avgRatings[capitalizedKey] += feedback.ratings[key];
                    avgCount[capitalizedKey] += 1
                }
            });
        });

        Object.keys(avgRatings).forEach(key => {
            console.log(avgRatings[key], avgCount[key])
            avgRatings[key] /= avgCount[key]
        });
        console.log(avgRatings);

        // const minRating = 1.0;
        // Object.keys(avgRatings).forEach(key => {
        //     if (avgRatings[key] < minRating) {
        //         avgRatings[key] = minRating;
        //     }
        // });

        // const maxRating = Math.max(...Object.values(avgRatings));
        // const scaleFactor = maxRating < 5 ? 5 / maxRating : 1;
        // Object.keys(avgRatings).forEach(key => {
        //     avgRatings[key] = Math.max((avgRatings[key] * scaleFactor).toFixed(2), minRating);
        // });

        const categories = Object.keys(avgRatings);
        const ratingsData = Object.values(avgRatings);

        const radarChartBuffer = await chartJSNodeCanvas.renderToBuffer({
            type: "radar",
            data: {
                labels: categories,
                datasets: [{
                    label: "Average Ratings",
                    data: ratingsData,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        min: 0,
                        max: 5,
                        pointLabels: {
                            font: { size: 16 }
                        },
                        ticks: {
                            font: { size: 14 },
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: { size: 16 }
                        }
                    }
                }
            }
        });

        const lineChartBuffer = await chartJSNodeCanvas.renderToBuffer({
            type: "line",
            data: {
                labels: feedbacks.map((_, index) => `${_.interaction.name}`),
                datasets: [{
                    label: "Ratings Trend",
                    data: feedbacks.map(fb => fb.avg_rating),
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        min: 0,
                    }
                }
            }
        });
        const boldOpenSans = "assets/fonts/OpenSans-Bold.ttf";
        const regularOpenSans = "assets/fonts/OpenSans-Regular.ttf";
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Intern_${internId}_Report.pdf`);
        doc.pipe(res);

        doc.registerFont("OpenSans-Bold", boldOpenSans);
        doc.registerFont("OpenSans-Regular", regularOpenSans);

        doc.font("OpenSans-Bold").fontSize(20).text("Intern Performance Report", { align: "center" });
        doc.moveDown(1);

        doc.font("OpenSans-Regular").fontSize(12);
        const leftIndent = 50;
        doc.text(`Intern ID: ${internDetail.employeeId}`, leftIndent);
        doc.text(`Intern Name: ${internDetail.name}`, leftIndent);
        doc.text(`Phase: ${internDetail.phase}`, leftIndent);
        doc.text(`Batch: ${internDetail.year}-${internDetail.batch}`, leftIndent);
        doc.moveDown(1);

        doc.font("OpenSans-Bold").fontSize(16).text("Summary", { align: "center" });
        doc.moveDown(0.5);

        const summaryText = feedbackSummary.data?.[0]?.summary_text || "No summary available.";
        doc.font("OpenSans-Regular").fontSize(12).text(summaryText, {
            align: "justify",
            indent: 20,
            width: doc.page.width - 100
        });
        doc.moveDown(1);

        doc.font("OpenSans-Bold").fontSize(16).text("Average Ratings", { align: "center" });
        doc.moveDown(1);

        if (categories.length && ratingsData.length) {
            categories.forEach((category, index) => {
                const rating = ratingsData[index] !== undefined ? ratingsData[index].toFixed(2) : "N/A";
                doc.font("OpenSans-Regular").fontSize(12).text(`${category}: ${rating} / 5`, leftIndent);
            });
        } else {
            doc.font("OpenSans-Regular").fontSize(12).text("No rating data available.", { align: "center" });
        }
        doc.moveDown(2);

        doc.font("OpenSans-Bold").fontSize(16).text("Charts & Visualizations", { align: "center" });
        doc.moveDown(1);

        const pageWidth = doc.page.width - 100;
        const chartWidth = (pageWidth / 2) - 10;
        const chartHeight = 200;

        if (radarChartBuffer && lineChartBuffer) {
            const startX = 50;
            const startY = doc.y;

            doc.image(radarChartBuffer, startX, startY, { width: chartWidth, height: chartHeight });
            doc.image(lineChartBuffer, startX + chartWidth + 20, startY, { width: chartWidth, height: chartHeight });

            doc.moveDown(chartHeight / 12);
        } else {
            doc.font("OpenSans-Regular").fontSize(12).text("Charts are not available.", { align: "center" });
        }

        doc.end();



    }
    catch (error) {
        logger.error(error.message);
        sendResponse(res, 500, "Internal Server Error");
    }
}