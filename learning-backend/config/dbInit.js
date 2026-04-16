const db = require("./mysql");

const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });

const ensureUsersTable = async () => {
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'employee',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_role (role)
    ) ENGINE=InnoDB
  `);
};

const ensureJobPortalTables = async () => {
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS job_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recruiter_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      job_type VARCHAR(80) NOT NULL,
      experience_level VARCHAR(80) NOT NULL,
      salary_range VARCHAR(120) NULL,
      skills_required TEXT NULL,
      description LONGTEXT NOT NULL,
      application_deadline DATE NULL,
      status VARCHAR(30) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_job_posts_recruiter_id (recruiter_id),
      INDEX idx_job_posts_status (status),
      CONSTRAINT fk_job_posts_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await queryAsync(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      applicant_id INT NOT NULL,
      full_name VARCHAR(160) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      resume_link VARCHAR(600) NULL,
      cover_letter LONGTEXT NULL,
      status VARCHAR(40) DEFAULT 'submitted',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_job_application (job_id, applicant_id),
      INDEX idx_job_applications_job_id (job_id),
      INDEX idx_job_applications_applicant_id (applicant_id),
      CONSTRAINT fk_job_applications_job FOREIGN KEY (job_id) REFERENCES job_posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_job_applications_user FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
};

const ensureCoreTables = async () => {
  await ensureUsersTable();
  await ensureJobPortalTables();
};

module.exports = {
  ensureCoreTables,
  ensureUsersTable,
  ensureJobPortalTables,
};
