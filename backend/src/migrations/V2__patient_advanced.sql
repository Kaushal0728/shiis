-- ============================================================
-- Migration V2: Advanced Patient Management
-- Run this against HealthcareInventoryDB
-- ============================================================

-- ── 1. Add new columns to Patient table ─────────────────────

-- Soft delete
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'is_deleted'
)
BEGIN
  ALTER TABLE Patient ADD is_deleted BIT NOT NULL DEFAULT 0;
  PRINT 'Added column: Patient.is_deleted';
END

IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'deleted_at'
)
BEGIN
  ALTER TABLE Patient ADD deleted_at DATETIME NULL;
  PRINT 'Added column: Patient.deleted_at';
END

IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'deleted_by'
)
BEGIN
  ALTER TABLE Patient ADD deleted_by INT NULL;
  PRINT 'Added column: Patient.deleted_by';
END

-- Audit timestamps
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'updated_at'
)
BEGIN
  ALTER TABLE Patient ADD updated_at DATETIME NULL;
  PRINT 'Added column: Patient.updated_at';
END

IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'created_by'
)
BEGIN
  ALTER TABLE Patient ADD created_by INT NULL;
  PRINT 'Added column: Patient.created_by';
END

IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('Patient') AND name = 'updated_by'
)
BEGIN
  ALTER TABLE Patient ADD updated_by INT NULL;
  PRINT 'Added column: Patient.updated_by';
END

-- ── 2. Index for soft-delete queries ────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE object_id = OBJECT_ID('Patient') AND name = 'IX_Patient_IsDeleted'
)
BEGIN
  CREATE INDEX IX_Patient_IsDeleted ON Patient (is_deleted, created_at DESC);
  PRINT 'Created index: IX_Patient_IsDeleted';
END

-- ── 3. Create PatientAudit table ────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM sys.tables WHERE name = 'PatientAudit'
)
BEGIN
  CREATE TABLE PatientAudit (
    audit_id    INT IDENTITY(1,1) PRIMARY KEY,
    patient_id  INT           NOT NULL,
    changed_by  INT           NULL,
    action      VARCHAR(10)   NOT NULL,   -- CREATE | UPDATE | DELETE
    snapshot    NVARCHAR(MAX) NOT NULL,   -- JSON of patient record
    diff        NVARCHAR(MAX) NULL,       -- JSON of changed fields only
    changed_at  DATETIME      NOT NULL DEFAULT GETDATE()
  );

  CREATE INDEX IX_PatientAudit_PatientId
    ON PatientAudit (patient_id, changed_at DESC);

  PRINT 'Created table: PatientAudit';
END

-- ── 4. Stored procedure: patient summary ────────────────────
-- Returns a single patient with computed age and audit counts.

IF OBJECT_ID('sp_GetPatientSummary', 'P') IS NOT NULL
  DROP PROCEDURE sp_GetPatientSummary;
GO

CREATE PROCEDURE sp_GetPatientSummary
  @patientId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    p.patient_id    AS patientId,
    p.first_name    AS firstName,
    p.last_name     AS lastName,
    p.dob,
    DATEDIFF(YEAR, p.dob, GETDATE())
      - CASE
          WHEN MONTH(p.dob) > MONTH(GETDATE())
            OR (MONTH(p.dob) = MONTH(GETDATE()) AND DAY(p.dob) > DAY(GETDATE()))
          THEN 1 ELSE 0
        END         AS age,
    p.gender,
    p.phone,
    p.email,
    p.address,
    p.is_deleted    AS isDeleted,
    p.created_at    AS createdAt,
    p.updated_at    AS updatedAt,
    (
      SELECT COUNT(*) FROM PatientAudit a WHERE a.patient_id = p.patient_id
    )               AS auditCount,
    (
      SELECT TOP 1 a.changed_at
      FROM PatientAudit a
      WHERE a.patient_id = p.patient_id
      ORDER BY a.changed_at DESC
    )               AS lastModified
  FROM Patient p
  WHERE p.patient_id = @patientId;
END
GO

PRINT 'Created stored procedure: sp_GetPatientSummary';

-- ── 5. Stored procedure: duplicate detection ────────────────

IF OBJECT_ID('sp_FindDuplicatePatients', 'P') IS NOT NULL
  DROP PROCEDURE sp_FindDuplicatePatients;
GO

CREATE PROCEDURE sp_FindDuplicatePatients
AS
BEGIN
  SET NOCOUNT ON;

  -- Find patients sharing the same first name, last name, and DOB
  SELECT
    p1.patient_id   AS patientId1,
    p2.patient_id   AS patientId2,
    p1.first_name   AS firstName,
    p1.last_name    AS lastName,
    p1.dob,
    p1.phone        AS phone1,
    p2.phone        AS phone2
  FROM Patient p1
  JOIN Patient p2
    ON  p1.first_name = p2.first_name
    AND p1.last_name  = p2.last_name
    AND p1.dob        = p2.dob
    AND p1.patient_id < p2.patient_id
  WHERE p1.is_deleted = 0
    AND p2.is_deleted = 0
  ORDER BY p1.last_name, p1.first_name;
END
GO

PRINT 'Created stored procedure: sp_FindDuplicatePatients';
