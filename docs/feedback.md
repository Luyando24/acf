# **ACF Website — Client Feedback & Implementation Requirements**

## **Objective**

Implement the changes requested by the Agricultural Consultative Forum (ACF) following the client feedback meeting. Improve the website’s readability, visual presentation, and content management capabilities while maintaining its existing identity and functionality.

## **1\. Homepage Content & Layout**

### **1.1 Reduce homepage text**

* Reduce the amount of text displayed on the homepage.  
* Rewrite or shorten lengthy sections while preserving essential information and the intended message.  
* Improve content hierarchy so visitors can understand key information quickly.  
* Reduce unnecessary scrolling and make the homepage more concise.  
* Do not remove important information without ensuring it remains accessible elsewhere on the website.

### **1.2 Temporarily hide homepage statistics**

* Hide the statistics section immediately below the hero section.  
* Treat this as a temporary change, not permanent deletion.  
* Preserve the existing statistics data and implementation so the section can be restored easily when requested.

### **1.3 Remove contact information from the top**

* Remove the contact information currently displayed at the top of the website.  
* Keep the main navigation and other necessary header elements intact.  
* Do not remove the contact page or other contact information elsewhere unless explicitly requested.

## **2\. Visual Design & Branding**

### **2.1 Lighten the green theme**

* The current green theme is too dark.  
* Adjust the green colour palette to create a lighter, more welcoming appearance.  
* Maintain consistency across the website, including buttons, backgrounds, navigation, cards, and other elements that use green.  
* Preserve ACF's existing brand identity while improving visual balance.

### **2.2 Improve text contrast**

* Minimize the use of green text on green backgrounds.  
* Use appropriate contrasting text colours to ensure readability.  
* Prefer dark text on light green backgrounds or white text on sufficiently dark green backgrounds, depending on the design.  
* Check contrast across headings, body text, buttons, links, and interactive elements.

### **2.3 Improve image presentation**

* Improve the presentation and visual consistency of images throughout the website.  
* Review image sizing, aspect ratios, cropping, alignment, spacing, and placement.  
* Ensure images display properly across desktop, tablet, and mobile devices.  
* Use consistent image treatments where appropriate.  
* Preserve existing image assets unless replacement is necessary and supported by available content.  
* Avoid stretching, awkward cropping, or inconsistent image dimensions.

## **3\. Content Management & Editability**

Ensure the following information can be managed and updated without requiring changes directly to the application code.

### **3.1 Working hours**

* Make the website's working hours editable through the existing administrative interface or content management mechanism.  
* Allow authorized administrators to update the displayed hours.  
* Ensure changes are reflected wherever the working hours appear on the website.

### **3.2 Membership information and requirements**

* Add a dedicated section or page for membership information and requirements, using the existing website structure where appropriate.  
* Present the available membership information clearly, including eligibility criteria, application requirements, and relevant instructions where this information has been provided by ACF.  
* Make the content editable by authorized administrators.  
* Do not invent membership requirements. Use existing approved content or leave missing information clearly identified for the client to provide.

### **3.3 Editable membership categories**

* Make membership categories configurable and editable by authorized administrators.  
* Allow administrators to update existing category names and descriptions, where applicable.  
* Ensure the website displays the latest saved categories consistently.  
* Preserve existing membership data and avoid breaking any functionality that depends on these categories.

## **4\. Implementation Guidelines**

1. Inspect the existing website and identify the relevant pages, components, content sources, and administrative interfaces before making changes.  
2. Reuse the existing architecture and components wherever practical.  
3. Preserve existing functionality, data, and approved content unless a change is explicitly required above.  
4. Ensure all new or modified administrative controls are accessible only to authorized users.  
5. Verify that the changes work across desktop and mobile screen sizes.  
6. Avoid introducing unrelated redesigns or features outside the agreed scope.  
7. Do not delete temporarily hidden sections or data; implement reversible changes wherever possible.

## **5\. Acceptance Criteria**

The work will be considered complete when:

* The homepage contains less text and requires less scrolling (sections like facebook feed can be removed from the landing page).  
* The statistics section below the hero is hidden but can be restored.  
* Contact information has been removed from the top of the website without disrupting navigation.  
* The green theme is lighter and visually consistent.  
* Green text on green backgrounds has been minimized, with readable contrast throughout.  
* Images have improved sizing, cropping, alignment, and responsive presentation.  
* Working hours can be updated by an authorized administrator.  
* Membership information and requirements are displayed clearly and can be edited.  
* Membership categories can be edited without modifying application code.  
* Existing functionality and data remain intact.  
* All changes have been tested on desktop and mobile devices.

## **6\. Scope Clarification**

Where any requested change depends on missing content, unclear business rules, or an ambiguous existing feature, inspect the current implementation and flag the specific uncertainty rather than inventing requirements.