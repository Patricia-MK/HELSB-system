import React from "react";
import "./ScreenGuidelines.css";
import gradImage from "../assets/images/grad.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";

const ScreenGuidelines = ({ closeGuidelines }) => {
  return (
    <div className="guidelines-overlay">
      <div className="guidelines-container">
        {/* Header */}
        <div className="guidelines-header">
          <div className="header-content">
            <img src={helsbLogo} alt="HELSB Logo" className="header-logo" />
            <div className="header-text">
              <h1>Student Screening Guidelines</h1>
              <p>Complete your annual screening to maintain loan eligibility</p>
            </div>
            <button className="close-guidelines-btn" onClick={closeGuidelines}>
              <span>← Back to Dashboard</span>
            </button>
          </div>
        </div>

        <div className="guidelines-content">
          {/* What is Screening Section */}
          <section className="guideline-section">
            <div className="section-header">
              <h2>What is Student Screening?</h2>
            </div>
            <div className="section-body">
              <p>
                Student screening is the annual verification process that confirms your academic progress 
                and ensures you remain eligible to continue receiving your student loan benefits. This process 
                helps HELSB maintain the integrity of the loan program while supporting your educational journey.
              </p>
              <div className="info-card">
                <div className="info-content">
                  <h4>Annual Verification</h4>
                  <p>Confirm your academic standing and personal details each year</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why We Screen Section */}
          <section className="guideline-section">
            <div className="section-header">
              <h2>Why Screening Matters</h2>
            </div>
            <div className="section-body">
              <p>
                Regular screening ensures that loan funds are allocated to deserving students who are 
                making satisfactory academic progress toward their degrees.
              </p>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <h4>Track Progress</h4>
                  <p>Monitor your academic journey and performance</p>
                </div>
                <div className="benefit-card">
                  <h4>Fund Management</h4>
                  <p>Ensure proper allocation of loan resources</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🎓</div>
                  <h4>Support Success</h4>
                  <p>Maintain eligibility for continued financial support</p>
                </div>
                <div className="benefit-card">
                  <h4>Program Integrity</h4>
                  <p>Uphold the standards of the loan program</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Easy Steps */}
          <section className="steps-section">
            <div className="section-header center-header">
              <h2>4 Easy Steps to Complete Screening</h2>
              <p>Follow these simple steps to successfully complete your annual screening</p>
            </div>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Review Your Profile</h3>
                  <p>Check and confirm your personal and academic information is accurate and up-to-date</p>
                </div>
                <div className="step-action">
                  <span className="action-text">Go to Profile</span>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Complete Agreement Form</h3>
                  <p>Fill out the digital loan agreement with your current academic and banking details</p>
                </div>
                <div className="step-action">
                  <span className="action-text">Start Form</span>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Upload Documents</h3>
                  <p>Submit all required supporting documents based on your student status</p>
                </div>
                <div className="step-action">
                  <span className="action-text">Upload Files</span>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Final Review</h3>
                  <p>Verify all information and documents before final submission</p>
                </div>
                <div className="step-action">
                  <span className="action-text">Confirm & Submit</span>
                </div>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section className="important-section">
            <div className="section-header">
              <div className="section-icon">⚠️</div>
              <h2>Important Information</h2>
            </div>
            <div className="important-grid">
              <div className="important-item">
                <div>
                  <h4>Deadline Awareness</h4>
                  <p>Complete screening within the allocated time frame to avoid interruptions</p>
                </div>
              </div>
              <div className="important-item">
                <div>
                  <h4>Document Quality</h4>
                  <p>Ensure all uploaded documents are clear, legible, and valid</p>
                </div>
              </div>
              <div className="important-item">
                <div>
                  <h4>Accuracy Check</h4>
                  <p>Double-check all information before final submission</p>
                </div>
              </div>
              <div className="important-item">
                <div>
                  <h4>Support Available</h4>
                  <p>Contact HELSB support if you encounter any issues during the process</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="guidelines-footer">
          <p className="support-contact">
            Need assistance? Contact <strong>HELSB Support</strong> at 
            <span className="contact-email"> support@helsb.gov.zm</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenGuidelines;