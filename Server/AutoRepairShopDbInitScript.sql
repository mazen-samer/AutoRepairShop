-- Create the AutoRepairShop Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AutoRepairShop')
BEGIN
    CREATE DATABASE AutoRepairShop;
END
GO

-- Use the AutoRepairShop Database
USE AutoRepairShop;
GO

-- Create the Service Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Service' AND xtype='U')
BEGIN
    CREATE TABLE Service (
        ServiceId INT PRIMARY KEY IDENTITY(1,1), -- Primary Key, auto-incrementing
        Name NVARCHAR(255) NOT NULL,             -- Name of the service
        Price DECIMAL(10, 2) NOT NULL,            -- Price of the service
        Description NVARCHAR(MAX) NULL,           -- Optional description of the service
        Tax DECIMAL(10, 2) NULL DEFAULT 0.00,     -- Tax amount or rate for the service
        Discount DECIMAL(10, 2) NULL DEFAULT 0.00 -- Discount amount or rate for the service

    );

    PRINT 'Service table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Service table already exists in AutoRepairShop database.';
END
GO


-- Create the Customer Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customer' AND xtype='U')
BEGIN
    CREATE TABLE Customer (
        CarPlate NVARCHAR(50) PRIMARY KEY,      -- Primary Key, vehicle license plate
        Name NVARCHAR(255) NOT NULL,            -- Customer's full name
        PhoneNumber NVARCHAR(50) NULL,          -- Customer's phone number
        Email NVARCHAR(255) NULL,               -- Customer's email address
        Mileage INT NULL,                       -- Current mileage of the vehicle
        BillingAddress NVARCHAR(MAX) NULL,      -- Customer's billing address
        ShippingAddress NVARCHAR(MAX) NULL,     -- Customer's shipping address (if different)
        TaxIdentificationNumber NVARCHAR(100) NULL, -- Customer's tax ID
        Status NVARCHAR(50) NULL                -- Customer's status (New, Returning, VIP, Has Outstanding Balance)
    );

    PRINT 'Customer table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Customer table already exists in AutoRepairShop database.';
END
GO

-- Create the Appointment Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Appointment' AND xtype='U')
BEGIN
    CREATE TABLE Appointment (
        AppointmentId INT PRIMARY KEY IDENTITY(1,1), -- Primary Key, auto-incrementing
        CarPlate NVARCHAR(50) NOT NULL,              -- Foreign Key referencing Customer
        ServiceId INT NOT NULL,                      -- Foreign Key referencing Service
        AppointmentDate DATE NOT NULL,               -- Date of the appointment
        AppointmentTime TIME NOT NULL,               -- Time of the appointment
        Staff NVARCHAR(255) NULL,                    -- Staff member assigned
        Status NVARCHAR(50) NOT NULL
        CONSTRAINT CK_Appointment_Status CHECK (Status IN ('Pending', 'Completed', 'Denied')), -- Status of the appointment
		
        CONSTRAINT FK_Appointment_Customer FOREIGN KEY (CarPlate) REFERENCES Customer(CarPlate),
        CONSTRAINT FK_Appointment_Service FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId)
    );

    CREATE INDEX IX_Appointment_CarPlate ON Appointment (CarPlate);
    CREATE INDEX IX_Appointment_ServiceId ON Appointment (ServiceId);
    CREATE INDEX IX_Appointment_DateTime ON Appointment (AppointmentDate, AppointmentTime);


    PRINT 'Appointment table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Appointment table already exists in AutoRepairShop database.';
END
GO

-- Create the Instruction Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Instruction' AND xtype='U')
BEGIN
    CREATE TABLE Instruction (
        InstructionId INT PRIMARY KEY IDENTITY(1,1), -- Primary Key, auto-incrementing
        ServiceId INT NOT NULL,                      -- Foreign Key referencing Service
        CarPlate NVARCHAR(50) NOT NULL,              -- Foreign Key referencing Customer
        InstructionsBefore NVARCHAR(MAX) NULL,       -- Instructions before the service
        InstructionsDuring NVARCHAR(MAX) NULL,       -- Instructions during the service
        InstructionsAfter NVARCHAR(MAX) NULL,        -- Instructions after the service

        CONSTRAINT FK_Instruction_Service FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId),
        CONSTRAINT FK_Instruction_Customer FOREIGN KEY (CarPlate) REFERENCES Customer(CarPlate)
    );

    CREATE INDEX IX_Instruction_ServiceId ON Instruction (ServiceId);
    CREATE INDEX IX_Instruction_CarPlate ON Instruction (CarPlate);

    PRINT 'Instruction table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Instruction table already exists in AutoRepairShop database.';
END
GO

-- Create the Invoice Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Invoice' AND xtype='U')
BEGIN
    CREATE TABLE Invoice (
        InvoiceId INT PRIMARY KEY IDENTITY(1,1),        -- Primary Key, auto-incrementing
        InvoiceDate DATE NOT NULL DEFAULT GETDATE(),    -- Date the invoice was created
        CarPlate NVARCHAR(50) NOT NULL,                 -- Foreign Key referencing Customer
        DueDate DATE NULL,                              -- Date the invoice is due
        OrderReference NVARCHAR(255) NULL,              -- Reference for the order related to the invoice
        Status NVARCHAR(50) NOT NULL
        CONSTRAINT CK_Invoice_Status CHECK (Status IN ('Draft', 'Unpaid', 'Partially Paid', 'Paid', 'Cancelled')), -- Status of the invoice
        InternalReference NVARCHAR(255) NULL,           -- Internal reference code for the invoice
        AdditionalNotes NVARCHAR(MAX) NULL,             -- Any additional notes for the invoice
        InvoiceNotes NVARCHAR(MAX) NULL,                -- Specific notes appearing on the invoice document
        PaymentMethod NVARCHAR(100) NULL,               -- Method of payment
        AmountPaid DECIMAL(10, 2) NULL DEFAULT 0.00,    -- Amount that has been paid on this invoice

        CONSTRAINT FK_Invoice_Customer FOREIGN KEY (CarPlate) REFERENCES Customer(CarPlate)

    );

    CREATE INDEX IX_Invoice_CarPlate ON Invoice (CarPlate);
    CREATE INDEX IX_Invoice_Status ON Invoice (Status);
    CREATE INDEX IX_Invoice_DueDate ON Invoice (DueDate);

    PRINT 'Invoice table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Invoice table already exists in AutoRepairShop database.';
END
GO

-- Create the InvoiceService Table (Junction Table for Invoice and Service)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='InvoiceService' AND xtype='U')
BEGIN
    CREATE TABLE InvoiceService (
        InvoiceServiceId INT PRIMARY KEY IDENTITY(1,1), -- Primary Key for the junction table entry
        InvoiceId INT NOT NULL,                         -- Foreign Key referencing Invoice
        ServiceId INT NOT NULL,                         -- Foreign Key referencing Service
        UnitPrice DECIMAL(10,2) NOT NULL,               -- Price of the service at the time of invoicing (to handle price changes over time)
        Quantity INT NOT NULL DEFAULT 1,                -- Quantity of the service on the invoice
        
        CONSTRAINT FK_InvoiceService_Invoice FOREIGN KEY (InvoiceId) REFERENCES Invoice(InvoiceId),
        CONSTRAINT FK_InvoiceService_Service FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId),

    );

    CREATE INDEX IX_InvoiceService_InvoiceId ON InvoiceService (InvoiceId);
    CREATE INDEX IX_InvoiceService_ServiceId ON InvoiceService (ServiceId);

    PRINT 'InvoiceService table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'InvoiceService table already exists in AutoRepairShop database.';
END
GO

-- Create the Feedback Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Feedback' AND xtype='U')
BEGIN
    CREATE TABLE Feedback (
        FeedbackId INT PRIMARY KEY IDENTITY(1,1),
        FeedbackDate DATE NULL, -- HTML input name: date
        CustomerName NVARCHAR(255) NULL, -- HTML input name: customerName
        PhoneNumber NVARCHAR(50) NULL, -- HTML input name: phoneNumber
        CarType NVARCHAR(100) NULL, -- HTML input name: carType
        CarModel NVARCHAR(100) NULL, -- HTML input name: carModel (Car Model and Year)
        LicensePlate NVARCHAR(50) NULL, -- HTML input name: licensePlate
        PreviousVisitsNumber INT NULL, -- HTML input name: numPreviousVisits

        -- Section 1: Quality and Technical Service (from HTML)
        TechnicianSkills NVARCHAR(50) NULL, -- HTML input name: technicianSkills
        CertifiedMaintenance NVARCHAR(10) NULL, -- HTML input name: certifiedMaintenance (Yes/No)
        AccuracyInDiagnosis NVARCHAR(50) NULL, -- HTML input name: accuracyInDiagnosis
        ModernTechUsage NVARCHAR(50) NULL, -- HTML input name: modernTechUsage
        OriginalSpareParts NVARCHAR(10) NULL, -- HTML input name: originalSpareParts (Yes/No)
        FutureRecommendations NVARCHAR(10) NULL, -- HTML input name: futureRecommendations (Yes/No)

        -- Section 2: Time Efficiency (from HTML)
        WorkCompletedOnTime NVARCHAR(10) NULL, -- HTML input name: workCompletedOnTime (Yes/No)
        ServiceSpeed NVARCHAR(50) NULL, -- HTML input name: serviceSpeed
        Flexibility NVARCHAR(50) NULL, -- HTML input name: flexibility
        InformedDuration NVARCHAR(10) NULL, -- HTML input name: informedDuration (Yes/No)

        -- Section 3: Pricing and Transparency (from HTML)
        PricingFairness NVARCHAR(50) NULL, -- HTML input name: pricingFairness
        InvoiceClarity NVARCHAR(50) NULL, -- HTML input name: invoiceClarity
        CostExplained NVARCHAR(10) NULL, -- HTML input name: costExplained (Yes/No)
        UnexpectedCosts NVARCHAR(10) NULL, -- HTML input name: unexpectedCosts (Yes/No)
        DiscountsOffered NVARCHAR(50) NULL, -- HTML input name: discountsOffered

        -- Section 4: Customer Interaction (from HTML)
        StaffProfessionalism NVARCHAR(50) NULL, -- HTML input name: staffProfessionalism
        ExplanationClarity NVARCHAR(50) NULL, -- HTML input name: explanationClarity
        CustomerAttention NVARCHAR(50) NULL, -- HTML input name: customerAttention
        AdditionalApprovalContacted NVARCHAR(10) NULL, -- HTML input name: additionalApproval (Yes/No)
        SatisfactionWithResponses NVARCHAR(50) NULL, -- HTML input name: satisfaction

        -- Section 5: Reviews and Reputation (from HTML)
        HeardThroughRecommendation NVARCHAR(10) NULL, -- HTML input name: heardThroughRecommendation (Yes/No)
        OverallRating NVARCHAR(50) NULL, -- HTML input name: overallRating
        RecommendToOthers NVARCHAR(50) NULL, -- HTML input name: recommendToOthers
        ServiceIssuesHandledBefore NVARCHAR(10) NULL, -- HTML input name: serviceIssuesHandled (Yes/No)

        -- Section 6: Warranty and After-Sales Service (from HTML)
        WarrantyProvided NVARCHAR(10) NULL, -- HTML input name: warrantyProvided (Yes/No)
        WarrantyClarity NVARCHAR(50) NULL, -- HTML input name: warrantyClarity
        ReoccurrenceInfoProvided NVARCHAR(10) NULL, -- HTML input name: reoccurrenceInfo (Yes/No)
        PostMaintenanceIssuesHandling NVARCHAR(50) NULL, -- HTML input name: postMaintenanceIssues

        -- Section 7: Cleanliness and Organization (from HTML)
        CleanlinessAndOrganization NVARCHAR(50) NULL, -- HTML input name: cleanliness
        WaitingAreaComfort NVARCHAR(50) NULL, -- HTML input name: waitingArea
        AdditionalServicesAvailability NVARCHAR(50) NULL, -- HTML input name: additionalServices
        ParkingConvenience NVARCHAR(10) NULL, -- HTML input name: parking (Yes/No)
        
        CONSTRAINT FK_Feedback_Customer FOREIGN KEY (LicensePlate) REFERENCES Customer(CarPlate) ON DELETE SET NULL ON UPDATE CASCADE
    );


    PRINT 'Feedback table created successfully in AutoRepairShop database.';
END
ELSE
BEGIN
    PRINT 'Feedback table already exists in AutoRepairShop database.';
END
GO
