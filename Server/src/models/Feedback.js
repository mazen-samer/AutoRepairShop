const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feedback = sequelize.define(
  "Feedback",
  {
    FeedbackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FeedbackDate: DataTypes.DATEONLY,
    CustomerName: DataTypes.STRING(255),
    PhoneNumber: DataTypes.STRING(50),
    CarType: DataTypes.STRING(100),
    CarModel: DataTypes.STRING(100),
    LicensePlate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      // Foreign key association is defined in src/models/index.js
    },
    PreviousVisitsNumber: DataTypes.INTEGER,

    // Section 1: Quality and Technical Service
    TechnicianSkills: DataTypes.STRING(50),
    CertifiedMaintenance: DataTypes.STRING(10),
    AccuracyInDiagnosis: DataTypes.STRING(50),
    ModernTechUsage: DataTypes.STRING(50),
    OriginalSpareParts: DataTypes.STRING(10),
    FutureRecommendations: DataTypes.STRING(10),

    // Section 2: Time Efficiency
    WorkCompletedOnTime: DataTypes.STRING(10),
    ServiceSpeed: DataTypes.STRING(50),
    Flexibility: DataTypes.STRING(50),
    InformedDuration: DataTypes.STRING(10),

    // Section 3: Pricing and Transparency
    PricingFairness: DataTypes.STRING(50),
    InvoiceClarity: DataTypes.STRING(50),
    CostExplained: DataTypes.STRING(10),
    UnexpectedCosts: DataTypes.STRING(10),
    DiscountsOffered: DataTypes.STRING(50),

    // Section 4: Customer Interaction
    StaffProfessionalism: DataTypes.STRING(50),
    ExplanationClarity: DataTypes.STRING(50),
    CustomerAttention: DataTypes.STRING(50),
    AdditionalApprovalContacted: DataTypes.STRING(10),
    SatisfactionWithResponses: DataTypes.STRING(50),

    // Section 5: Reviews and Reputation
    HeardThroughRecommendation: DataTypes.STRING(10),
    OverallRating: DataTypes.STRING(50),
    RecommendToOthers: DataTypes.STRING(50),
    ServiceIssuesHandledBefore: DataTypes.STRING(10),

    // Section 6: Warranty and After-Sales Service
    WarrantyProvided: DataTypes.STRING(10),
    WarrantyClarity: DataTypes.STRING(50),
    ReoccurrenceInfoProvided: DataTypes.STRING(10),
    PostMaintenanceIssuesHandling: DataTypes.STRING(50),

    // Section 7: Cleanliness and Organization
    CleanlinessAndOrganization: DataTypes.STRING(50),
    WaitingAreaComfort: DataTypes.STRING(50),
    AdditionalServicesAvailability: DataTypes.STRING(50),
    ParkingConvenience: DataTypes.STRING(10),
  },
  {
    tableName: "Feedback",
    timestamps: false,
  }
);

module.exports = Feedback;
