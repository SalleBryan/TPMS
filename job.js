document.addEventListener('DOMContentLoaded', () => {
    // Data storage
    const jobDescriptions = {
        '201': 'Assist in development of software applications using modern frameworks. Collaborate with senior developers to implement new features and fix bugs.',
        '202': 'Support data analysis projects, create visualizations, and work with large datasets to provide business insights.',
        '203': 'Design user-friendly interfaces for web and mobile applications, collaborating with developers to ensure seamless functionality.',
        '204': 'Develop and execute marketing campaigns, analyze performance metrics, and enhance brand presence across digital platforms.'
    };
    let jobIdCounter = 205; // Start after sample jobs
    let userRole = '';
    const appliedJobs = new Set();
    let interviewIdCounter = 3; // Start after sample interviews

    // Calendar data - stores all interviews by date
    const interviewsByDate = {};

    // Initialize UI based on role
    window.selectRole = function(role) {
        userRole = role;
        document.getElementById('roleSelection').classList.add('hidden');

        // Set up navigation buttons based on role
        const navButtons = document.getElementById('navButtons');
        navButtons.innerHTML = '';

        if (role === 'admin' || role === 'student') {
            const studentBtn = document.createElement('button');
            studentBtn.textContent = 'Student View';
            studentBtn.className = 'btn btn-primary';
            studentBtn.onclick = () => showView('studentView');
            navButtons.appendChild(studentBtn);
        }

        if (role === 'admin' || role === 'recruiter') {
            const recruiterBtn = document.createElement('button');
            recruiterBtn.textContent = 'Recruiter View';
            recruiterBtn.className = 'btn btn-primary';
            recruiterBtn.onclick = () => showView('recruiterView');
            navButtons.appendChild(recruiterBtn);
        }

        if (role === 'admin') {
            const interviewBtn = document.createElement('button');
            interviewBtn.textContent = 'Interviews';
            interviewBtn.className = 'btn btn-primary';
            interviewBtn.onclick = () => showView('interviewView');
            navButtons.appendChild(interviewBtn);
        }

        // Show default view based on role
        if (role === 'student') {
            showView('studentView');
        } else if (role === 'recruiter') {
            showView('recruiterView');
        } else if (role === 'admin') {
            showView('studentView');
        }

        // Load initial data
        loadInitialData();
    };

    function showView(viewId) {
        const views = ['studentView', 'recruiterView', 'interviewView'];
        views.forEach(view => {
            document.getElementById(view).classList.add('hidden');
        });
        document.getElementById(viewId).classList.remove('hidden');

        // Initialize calendar when showing interview view
        if (viewId === 'interviewView') {
            initCalendar();
        }
    }

    function loadInitialData() {
        // Add four sample jobs to student view
        const jobTableBody = document.getElementById('jobTableBody');
        jobTableBody.innerHTML = '';

        const sampleJobs = [
            ['201', 'Software Intern', 'TechCorp', 'Buea', '2025-06-10'],
            ['202', 'Data Analyst Intern', 'DataWorks', 'Douala', '2025-06-15'],
            ['203', 'UI/UX Designer', 'CreativeLabs', 'Yaoundé', '2025-06-20'],
            ['204', 'Marketing Coordinator', 'BrandBoost', 'Limbe', '2025-06-25']
        ];

        sampleJobs.forEach(job => addJobToStudentTable(job));

        // Add four sample jobs to recruiter view
        const recruiterJobTableBody = document.getElementById('recruiterJobTableBody');
        recruiterJobTableBody.innerHTML = '';

        const recruiterSampleJobs = [
            ['201', 'Software Intern', 'TechCorp', 'Buea', '2025-06-10', jobDescriptions['201']],
            ['202', 'Data Analyst Intern', 'DataWorks', 'Douala', '2025-06-15', jobDescriptions['202']],
            ['203', 'UI/UX Designer', 'CreativeLabs', 'Yaoundé', '2025-06-20', jobDescriptions['203']],
            ['204', 'Marketing Coordinator', 'BrandBoost', 'Limbe', '2025-06-25', jobDescriptions['204']]
        ];

        recruiterSampleJobs.forEach(job => addJobToRecruiterTable(job));

        // Update job counter
        document.getElementById('totalJobsCount').textContent = recruiterSampleJobs.length;

        // Add sample interviews to admin view
        const interviewTableBody = document.getElementById('interviewTableBody');
        interviewTableBody.innerHTML = '';

        addInterviewToTable(['INT001', 'Student A', '2025-06-01', '10:00 AM', 'Scheduled']);
        addInterviewToTable(['INT002', 'Student B', '2025-06-02', '2:00 PM', 'Pending']);
    }

    function addJobToStudentTable(jobData) {
        const jobTableBody = document.getElementById('jobTableBody');
        const row = document.createElement('tr');
        row.className = 'table-row';

        jobData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.className = 'table-cell';
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        // Add click event to show job details
        row.addEventListener('click', () => {
            const jobId = jobData[0];
            const jobTitle = jobData[1];

            // Highlight selected row
            document.querySelectorAll('#jobTableBody tr').forEach(r => {
                r.classList.remove('selected');
            });
            row.classList.add('selected');

            // Display job details
            const jobDetailsArea = document.getElementById('jobDetailsArea');
            const desc = jobDescriptions[jobId] || 'No description available.';

            jobDetailsArea.innerHTML = `
                <h3 class="subsection-title">${jobTitle}</h3>
                <p>${desc}</p>
            `;

            // Enable buttons if job is not already applied for
            const applyButton = document.getElementById('applyButton');
            const withdrawButton = document.getElementById('withdrawButton');

            applyButton.disabled = false;
            withdrawButton.disabled = true;

            if (appliedJobs.has(jobId)) {
                applyButton.disabled = true;
                withdrawButton.disabled = false;
            }

            // Set up button actions with the job ID
            applyButton.onclick = () => applyForJob(jobId, jobTitle);
            withdrawButton.onclick = () => withdrawFromJob(jobId, jobTitle);
        });

        jobTableBody.appendChild(row);
    }

    function addJobToRecruiterTable(jobData) {
        const recruiterJobTableBody = document.getElementById('recruiterJobTableBody');
        const row = document.createElement('tr');

        jobData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.className = 'table-cell';
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        // Add actions column with Withdraw button
        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-cell actions';

        const withdrawButton = document.createElement('button');
        withdrawButton.className = 'btn btn-danger btn-small';
        withdrawButton.textContent = 'Withdraw';
        withdrawButton.onclick = () => withdrawJob(jobData[0], jobData[1], row);
        actionsCell.appendChild(withdrawButton);

        row.appendChild(actionsCell);
        recruiterJobTableBody.appendChild(row);

        // Update job counter
        document.getElementById('totalJobsCount').textContent = 
            document.getElementById('recruiterJobTableBody').childElementCount;
    }

    function withdrawJob(jobId, jobTitle, row) {
        showModal('Confirm Withdrawal', `Are you sure you want to withdraw the job "${jobTitle}"?`, [
            {
                text: 'Cancel',
                class: 'btn btn-primary',
                action: () => document.getElementById('modal').classList.add('hidden')
            },
            {
                text: 'Withdraw',
                class: 'btn btn-danger',
                action: () => {
                    // Remove from recruiter table
                    row.remove();

                    // Remove from student table
                    const jobTableBody = document.getElementById('jobTableBody');
                    Array.from(jobTableBody.children).forEach(jobRow => {
                        if (jobRow.children[0].textContent === jobId) {
                            jobRow.remove();
                        }
                    });

                    // Remove from jobDescriptions
                    delete jobDescriptions[jobId];

                    // Update job counter
                    document.getElementById('totalJobsCount').textContent = 
                        document.getElementById('recruiterJobTableBody').childElementCount;

                    // Clear job details if selected
                    const jobDetailsArea = document.getElementById('jobDetailsArea');
                    if (jobDetailsArea.querySelector('.subsection-title')?.textContent === jobTitle) {
                        jobDetailsArea.innerHTML = '<p class="text-muted">Select a job to view details</p>';
                        document.getElementById('applyButton').disabled = true;
                        document.getElementById('withdrawButton').disabled = true;
                    }

                    // Close modal and show success
                    document.getElementById('modal').classList.add('hidden');
                    showModal('Job Withdrawn', `The job "${jobTitle}" has been withdrawn.`);
                }
            }
        ]);
    }

    function refreshStudentJobTable() {
        const jobTableBody = document.getElementById('jobTableBody');
        jobTableBody.innerHTML = '';
        Object.keys(jobDescriptions).forEach(jobId => {
            const job = [
                jobId,
                document.querySelector(`#recruiterJobTableBody tr td:first-child[textContent="${jobId}"]`)?.parentElement.children[1].textContent,
                document.querySelector(`#recruiterJobTableBody tr td:first-child[textContent="${jobId}"]`)?.parentElement.children[2].textContent,
                document.querySelector(`#recruiterJobTableBody tr td:first-child[textContent="${jobId}"]`)?.parentElement.children[3].textContent,
                document.querySelector(`#recruiterJobTableBody tr td:first-child[textContent="${jobId}"]`)?.parentElement.children[4].textContent
            ];
            if (job[1]) addJobToStudentTable(job);
        });
    }

    // Calendar functionality
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Format date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Parse date from YYYY-MM-DD
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

    // Initialize calendar
    function initCalendar() {
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');

        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });

        renderCalendar();
        updateUpcomingInterviews();
    }

    // Render calendar for current month/year
    function renderCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Set current month/year display
        document.getElementById('currentMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Get first day of month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        // Get last day of month
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Add empty days for start of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarDays.appendChild(emptyDay);
        }

        // Get today's date for highlighting
        const today = new Date();
        const todayFormatted = formatDate(today);

        // Add days of month
        for (let day = 1; day <= lastDate; day++) {
            const dayElem = document.createElement('div');
            const date = new Date(currentYear, currentMonth, day);
            const dateFormatted = formatDate(date);

            // Check if this date has interviews
            const hasInterviews = interviewsByDate[dateFormatted] && interviewsByDate[dateFormatted].length > 0;

            // Style based on interviews and if it's today
            let className = 'calendar-day';

            if (dateFormatted === todayFormatted) {
                className += ' today';
            }

            if (hasInterviews) {
                className += ' scheduled';
            }

            dayElem.className = className;
            dayElem.textContent = day;

            // Add click event for days with interviews
            if (hasInterviews) {
                dayElem.addEventListener('click', () => {
                    showInterviewsForDate(dateFormatted);
                });
            }

            calendarDays.appendChild(dayElem);
        }
    }

    function showInterviewsForDate(dateStr) {
        if (interviewsByDate[dateStr] && interviewsByDate[dateStr].length > 0) {
            const interviews = interviewsByDate[dateStr];
            let message = `Interviews on ${dateStr}:\n`;

            interviews.forEach(interview => {
                message += `\n- ${interview.candidate} at ${interview.time} (${interview.status})`;
            });

            showModal('Interviews', message);
        }
    }

    // Update upcoming interviews list
    function updateUpcomingInterviews() {
        const upcomingList = document.getElementById('upcomingInterviews');
        upcomingList.innerHTML = '';

        // Get today's date
        const today = new Date();

        // Get and sort all interview dates
        const allDates = Object.keys(interviewsByDate).sort();

        // Filter for upcoming dates
        const upcomingDates = allDates.filter(dateStr => {
            const interviewDate = parseDate(dateStr);
            return interviewDate >= today;
        }).slice(0, 5); // Show next 5 dates

        if (upcomingDates.length === 0) {
            const noInterviews = document.createElement('li');
            noInterviews.className = 'text-muted';
            noInterviews.textContent = 'No upcoming interviews scheduled.';
            upcomingList.appendChild(noInterviews);
            return;
        }

        // Add each upcoming interview
        upcomingDates.forEach(dateStr => {
            const interviews = interviewsByDate[dateStr];

            interviews.forEach(interview => {
                const listItem = document.createElement('li');
                listItem.className = '';

                const dateDiv = document.createElement('div');
                dateDiv.textContent = dateStr;

                const infoDiv = document.createElement('div');
                infoDiv.textContent = `${interview.time} - ${interview.candidate}`;

                listItem.appendChild(dateDiv);
                listItem.appendChild(infoDiv);
                upcomingList.appendChild(listItem);
            });
        });
    }

    function addInterviewToTable(interviewData) {
        const interviewTableBody = document.getElementById('interviewTableBody');
        const row = document.createElement('tr');

        interviewData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.className = 'table-cell';
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        // Add actions column
        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-cell actions';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary btn-small';
        editButton.textContent = 'Edit';
        editButton.onclick = () => showModal('Edit Interview', 'Edit functionality would go here');

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-small';
        deleteButton.textContent = 'Cancel';
        deleteButton.onclick = () => {
            showModal('Confirm Cancellation', 'Are you sure you want to cancel this interview?', [
                {
                    text: 'No',
                    class: 'btn btn-primary',
                    action: () => document.getElementById('modal').classList.add('hidden')
                },
                {
                    text: 'Yes',
                    class: 'btn btn-danger',
                    action: () => {
                        row.remove();
                        document.getElementById('modal').classList.add('hidden');
                        showModal('Interview Cancelled', 'The interview has been cancelled.');
                    }
                }
            ]);
        };

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        interviewTableBody.appendChild(row);

        // Add to calendar data if date is valid
        const id = interviewData[0];
        const candidate = interviewData[1];
        const date = interviewData[2];
        const time = interviewData[3];
        const status = interviewData[4];

        // Only add if it has a valid date format
        if (date && date.match(/\d{4}-\d{2}-\d{2}/)) {
            if (!interviewsByDate[date]) {
                interviewsByDate[date] = [];
            }

            interviewsByDate[date].push({
                id,
                candidate,
                time,
                status
            });

            // Update calendar if we're in interview view
            if (!document.getElementById('interviewView').classList.contains('hidden')) {
                renderCalendar();
                updateUpcomingInterviews();
            }
        }
    }

    function applyForJob(jobId, jobTitle) {
        if (!appliedJobs.has(jobId)) {
            appliedJobs.add(jobId);

            // Update application status
            const applicationsList = document.getElementById('applicationsList');
            const listItem = document.createElement('li');
            listItem.textContent = jobTitle;
            applicationsList.appendChild(listItem);

            document.getElementById('applicationStatus').classList.remove('hidden');

            // Update buttons
            document.getElementById('applyButton').disabled = true;
            document.getElementById('withdrawButton').disabled = false;

            showModal('Application Submitted', `Applied for ${jobTitle}`);
        }
    }

    function withdrawFromJob(jobId, jobTitle) {
        if (appliedJobs.has(jobId)) {
            appliedJobs.delete(jobId);

            // Update application status
            const applicationsList = document.getElementById('applicationsList');
            Array.from(applicationsList.children).forEach(item => {
                if (item.textContent === jobTitle) {
                    item.remove();
                }
            });

            if (applicationsList.children.length === 0) {
                document.getElementById('applicationStatus').classList.add('hidden');
            }

            // Update buttons
            document.getElementById('applyButton').disabled = false;
            document.getElementById('withdrawButton').disabled = true;

            showModal('Application Withdrawn', `Withdrawn from ${jobTitle}`);
        }
    }

    function showModal(title, message, buttons = [{ text: 'OK', class: 'btn btn-primary', action: () => document.getElementById('modal').classList.add('hidden') }]) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalClose = document.getElementById('modalClose');

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalClose.innerHTML = '';
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = btn.class;
            button.textContent = btn.text;
            button.onclick = btn.action;
            modalClose.appendChild(button);
        });

        modal.classList.remove('hidden');

        // Auto-close after 5 seconds if only one button
        if (buttons.length === 1) {
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 5000);
        }
    }

    // Event listeners for forms
    document.getElementById('jobPostForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('titleField').value.trim();
        const company = document.getElementById('companyField').value.trim();
        const location = document.getElementById('locationField').value.trim();
        const deadline = document.getElementById('deadlineField').value.trim();
        const description = document.getElementById('descriptionArea').value.trim();

        if (!title || !company || !location || !deadline) {
            showModal('Error', 'Please fill all required fields');
            return;
        }

        const id = String(jobIdCounter++);
        const jobData = [id, title, company, location, deadline, description];

        // Add to recruiter table
        addJobToRecruiterTable(jobData);

        // Add to student table (automatically approved)
        const studentJobData = [id, title, company, location, deadline];
        addJobToStudentTable(studentJobData);

        // Store job description
        jobDescriptions[id] = description;

        // Clear form
        document.getElementById('jobPostForm').reset();

        showModal('Job Posted', 'Job Posted Successfully!');
    });

    document.getElementById('scheduleInterviewForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const candidate = document.getElementById('candidateField').value.trim();
        const date = document.getElementById('interviewDateField').value.trim();
        const time = document.getElementById('interviewTimeField').value.trim();
        const status = document.getElementById('interviewStatusField').value;

        if (!candidate || !date || !time) {
            showModal('Error', 'Please fill all required fields');
            return;
        }

        const id = 'INT00' + interviewIdCounter;
        const interviewData = [id, candidate, date, time, status];

        addInterviewToTable(interviewData);

        // Clear form
        document.getElementById('scheduleInterviewForm').reset();

        showModal('Interview Scheduled', 'Interview Scheduled Successfully!');
    });
});