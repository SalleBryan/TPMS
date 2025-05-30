document.addEventListener('DOMContentLoaded', () => {
    // Data storage
    const users = {}; // { username: { password: string, role: string, secretId: string } }
    let currentUser = null; // { username: string, role: string }
    const jobDescriptions = {
        '201': 'Assist in development of software applications using modern frameworks.',
        '202': 'Support data analysis projects with visualizations and large datasets.',
        '203': 'Design user-friendly interfaces for web and mobile applications.',
        '204': 'Develop and execute marketing campaigns to enhance digital presence.'
    };
    let jobIdCounter = 205;
    const appliedJobs = new Set();
    let interviewIdCounter = 3;
    const interviewsByDate = {};

    // Auth functions
    window.showRegisterForm = function() {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    };

    window.showLoginForm = function() {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    };

    window.backToAuth = function() {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('authSection').classList.remove('hidden');
    };

    function registerUser(username, password, secretId, role) {
        if (!username || !password || !secretId || !role) {
            showModal('Error', 'All fields are required.');
            return false;
        }
        if (users[username]) {
            showModal('Error', 'Username already exists.');
            return false;
        }
        // Check if secret ID is unique
        for (let user in users) {
            if (users[user].secretId === secretId) {
                showModal('Error', 'Secret ID is already in use.');
                return false;
            }
        }
        users[username] = { password, role, secretId };
        return true;
    }

    function loginUser(username, password, secretId) {
        if (!users[username]) {
            showModal('Error', 'Username not found.');
            return false;
        }
        if (users[username].password !== password) {
            showModal('Error', 'Incorrect password.');
            return false;
        }
        if (users[username].secretId !== secretId) {
            showModal('Error', 'Invalid secret ID.');
            return false;
        }
        currentUser = { username, role: users[username].role };
        return true;
    }

    // Initialize UI based on role
    window.selectRole = function(role) {
        if (!currentUser) {
            showModal('Error', 'Please login to access this role.');
            return;
        }
        if (currentUser.role !== role) {
            showModal('Error', `Access denied. You are logged in as a ${currentUser.role}.`);
            return;
        }

        document.getElementById('authSection').classList.add('hidden');

        // Set up navigation buttons
        const navButtons = document.getElementById('navButtons');
        navButtons.innerHTML = '';

        if (role === 'student') {
            const studentBtn = document.createElement('button');
            studentBtn.textContent = 'Student View';
            studentBtn.className = 'btn btn-primary';
            studentBtn.onclick = () => showView('studentView');
            navButtons.appendChild(studentBtn);
        } else if (role === 'recruiter') {
            const recruiterBtn = document.createElement('button');
            recruiterBtn.textContent = 'Recruiter View';
            recruiterBtn.className = 'btn btn-primary';
            recruiterBtn.onclick = () => showView('recruiterView');
            navButtons.appendChild(recruiterBtn);
        } else if (role === 'admin') {
            const interviewBtn = document.createElement('button');
            interviewBtn.textContent = 'Interviews';
            interviewBtn.className = 'btn btn-primary';
            interviewBtn.onclick = () => showView('interviewView');
            navButtons.appendChild(interviewBtn);
        }

        // Add Logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'btn btn-danger';
        logoutBtn.onclick = () => {
            currentUser = null;
            appliedJobs.clear();
            showView('authSection');
            navButtons.innerHTML = '';
            showModal('Logged Out', 'You have been logged out.');
        };
        navButtons.appendChild(logoutBtn);

        // Show view based on role
        showView(role === 'student' ? 'studentView' : role === 'recruiter' ? 'recruiterView' : 'interviewView');

        // Load initial data
        loadInitialData();
    };

    function showView(viewId) {
        const views = ['authSection', 'registerForm', 'loginForm', 'studentView', 'recruiterView', 'interviewView'];
        views.forEach(view => {
            document.getElementById(view).classList.add('hidden');
        });
        document.getElementById(viewId).classList.remove('hidden');

        if (viewId === 'interviewView') {
            initCalendar();
        }
    }

    function loadInitialData() {
        // Student jobs
        const jobTableBody = document.getElementById('jobTableBody');
        jobTableBody.innerHTML = '';
        const sampleJobs = [
            ['201', 'Software Intern', 'TechCorp', 'Buea', '2025-06-10'],
            ['202', 'Data Analyst Intern', 'DataWorks', 'Douala', '2025-06-15'],
            ['203', 'UI/UX Designer', 'CreativeLabs', 'Yaoundé', '2025-06-20'],
            ['204', 'Marketing Coordinator', 'BrandBoost', 'Limbe', '2025-06-25']
        ];
        sampleJobs.forEach(job => addJobToStudentTable(job));

        // Recruiter jobs
        const recruiterJobTableBody = document.getElementById('recruiterJobTableBody');
        recruiterJobTableBody.innerHTML = '';
        const recruiterSampleJobs = [
            ['201', 'Software Intern', 'TechCorp', 'Buea', '2025-06-10', jobDescriptions['201']],
            ['202', 'Data Analyst Intern', 'DataWorks', 'Douala', '2025-06-15', jobDescriptions['202']],
            ['203', 'UI/UX Designer', 'CreativeLabs', 'Yaoundé', '2025-06-20', jobDescriptions['203']],
            ['204', 'Marketing Coordinator', 'BrandBoost', 'Limbe', '2025-06-25', jobDescriptions['204']]
        ];
        recruiterSampleJobs.forEach(job => addJobToRecruiterTable(job));
        document.getElementById('totalJobsCount').textContent = recruiterJobTableBody.childElementCount;

        // Interviews
        const interviewTableBody = document.getElementById('interviewTableBody');
        interviewTableBody.innerHTML = '';
        addInterviewToTable(['INT001', 'Student A', '2025-06-01', '10:00', 'Scheduled']);
        addInterviewToTable(['INT002', 'Student B', '2025-06-02', '14:00', 'Pending']);
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

        row.addEventListener('click', () => {
            const jobId = jobData[0];
            const jobTitle = jobData[1];

            document.querySelectorAll('#jobTableBody tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');

            const jobDetailsArea = document.getElementById('jobDetailsArea');
            const desc = jobDescriptions[jobId] || 'No description available.';
            jobDetailsArea.innerHTML = `
                <h3 class="subsection-title">${jobTitle}</h3>
                <p>${desc}</p>
            `;

            const applyButton = document.getElementById('applyButton');
            const withdrawButton = document.getElementById('withdrawButton');
            applyButton.disabled = appliedJobs.has(jobId);
            withdrawButton.disabled = !appliedJobs.has(jobId);

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

        const actionsCell = document.createElement('td');
        actionsCell.className = 'table-cell actions';
        const withdrawButton = document.createElement('button');
        withdrawButton.className = 'btn btn-danger btn-small';
        withdrawButton.textContent = 'Withdraw';
        withdrawButton.onclick = () => withdrawJob(jobData[0], jobData[1], row);
        actionsCell.appendChild(withdrawButton);
        row.appendChild(actionsCell);

        recruiterJobTableBody.appendChild(row);
        document.getElementById('totalJobsCount').textContent = recruiterJobTableBody.childElementCount;
    }

    function withdrawJob(jobId, jobTitle, row) {
        showModal('Confirm Withdrawal', `Are you sure you want to withdraw "${jobTitle}"?`, [
            { text: 'Cancel', class: 'btn btn-primary', action: () => document.getElementById('modal').classList.add('hidden') },
            {
                text: 'Withdraw', class: 'btn btn-danger', action: () => {
                    row.remove();
                    const jobTableBody = document.getElementById('jobTableBody');
                    Array.from(jobTableBody.children).forEach(r => {
                        if (r.children[0].textContent === jobId) r.remove();
                    });
                    delete jobDescriptions[jobId];
                    document.getElementById('totalJobsCount').textContent = document.getElementById('recruiterJobTableBody').childElementCount;
                    const jobDetailsArea = document.getElementById('jobDetailsArea');
                    if (jobDetailsArea.querySelector('.subsection-title')?.textContent === jobTitle) {
                        jobDetailsArea.innerHTML = '<p class="text-muted">Select a job to view details</p>';
                        document.getElementById('applyButton').disabled = true;
                        document.getElementById('withdrawButton').disabled = true;
                    }
                    document.getElementById('modal').classList.add('hidden');
                    showModal('Job Withdrawn', `"${jobTitle}" has been withdrawn.`);
                }
            }
        ]);
    }

    // Calendar functions
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

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

    function renderCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('currentMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarDays.appendChild(emptyDay);
        }

        const today = new Date();
        const todayFormatted = formatDate(today);

        for (let day = 1; day <= lastDate; day++) {
            const dayElem = document.createElement('div');
            const date = new Date(currentYear, currentMonth, day);
            const dateFormatted = formatDate(date);

            const hasInterviews = interviewsByDate[dateFormatted] && interviewsByDate[dateFormatted].length > 0;

            let className = 'calendar-day';
            if (dateFormatted === todayFormatted) className += ' today';
            if (hasInterviews) className += ' scheduled';

            dayElem.className = className;
            dayElem.textContent = day;

            if (hasInterviews) {
                dayElem.addEventListener('click', () => showInterviewsForDate(dateFormatted));
            }

            calendarDays.appendChild(dayElem);
        }
    }

    function showInterviewsForDate(dateStr) {
        if (interviewsByDate[dateStr]?.length > 0) {
            const interviews = interviewsByDate[dateStr];
            let message = `Interviews on ${dateStr}:\n` + interviews.map(i => `- ${i.candidate} at ${i.time} (${i.status})`).join('\n');
            showModal('Interviews', message);
        }
    }

    function updateUpcomingInterviews() {
        const upcomingList = document.getElementById('upcomingInterviews');
        upcomingList.innerHTML = '';

        const today = new Date();
        const upcomingDates = Object.keys(interviewsByDate)
            .filter(dateStr => parseDate(dateStr) >= today)
            .sort()
            .slice(0, 5);

        if (upcomingDates.length === 0) {
            const noInterviews = document.createElement('li');
            noInterviews.className = 'text-muted';
            noInterviews.textContent = 'No upcoming interviews scheduled.';
            upcomingList.appendChild(noInterviews);
            return;
        }

        upcomingDates.forEach(dateStr => {
            interviewsByDate[dateStr].forEach(interview => {
                const listItem = document.createElement('li');
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
                { text: 'No', class: 'btn btn-primary', action: () => document.getElementById('modal').classList.add('hidden') },
                {
                    text: 'Yes', class: 'btn btn-danger', action: () => {
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

        const id = interviewData[0];
        const candidate = interviewData[1];
        const date = interviewData[2];
        const time = interviewData[3];
        const status = interviewData[4];

        if (date && date.match(/\d{4}-\d{2}-\d{2}/)) {
            if (!interviewsByDate[date]) interviewsByDate[date] = [];
            interviewsByDate[date].push({ id, candidate, time, status });

            if (!document.getElementById('interviewView').classList.contains('hidden')) {
                renderCalendar();
                updateUpcomingInterviews();
            }
        }
    }

    function applyForJob(jobId, jobTitle) {
        if (!appliedJobs.has(jobId)) {
            appliedJobs.add(jobId);

            const applicationsList = document.getElementById('applicationsList');
            const listItem = document.createElement('li');
            listItem.textContent = jobTitle;
            applicationsList.appendChild(listItem);

            document.getElementById('applicationStatus').classList.remove('hidden');
            document.getElementById('applyButton').disabled = true;
            document.getElementById('withdrawButton').disabled = false;

            showModal('Application Submitted', `Applied for ${jobTitle}`);
        }
    }

    function withdrawFromJob(jobId, jobTitle) {
        if (appliedJobs.has(jobId)) {
            appliedJobs.delete(jobId);

            const applicationsList = document.getElementById('applicationsList');
            Array.from(applicationsList.children).forEach(item => {
                if (item.textContent === jobTitle) item.remove();
            });

            if (applicationsList.children.length === 0) {
                document.getElementById('applicationStatus').classList.add('hidden');
            }

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
        if (buttons.length === 1) {
            setTimeout(() => modal.classList.add('hidden'), 5000);
        }
    }

    // Event listeners for forms
    document.getElementById('registerFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const secretId = document.getElementById('regSecretId').value.trim();
        const role = document.getElementById('regRole').value;

        if (registerUser(username, password, secretId, role)) {
            showModal('Registration Successful', `Account created for ${username}. Please login.`, [
                {
                    text: 'OK',
                    class: 'btn btn-primary',
                    action: () => {
                        document.getElementById('modal').classList.add('hidden');
                        document.getElementById('registerFormElement').reset();
                        showLoginForm();
                    }
                }
            ]);
        }
    });

    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const secretId = document.getElementById('loginSecretId').value.trim();

        if (loginUser(username, password, secretId)) {
            document.getElementById('loginFormElement').reset();
            selectRole(currentUser.role);
        }
    });

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
        addJobToRecruiterTable(jobData);
        const studentJobData = [id, title, company, location, deadline];
        addJobToStudentTable(studentJobData);
        jobDescriptions[id] = description;

        document.getElementById('jobPostForm').reset();
        showModal('Job Posted', 'Job Posted Successfully');
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

        const id = 'INT00' + interviewIdCounter++;
        const interviewData = [id, candidate, date, time, status];
        addInterviewToTable(interviewData);

        document.getElementById('scheduleInterviewForm').reset();
        showModal('Interview Scheduled', 'Interview Scheduled Successfully!');
    });
});