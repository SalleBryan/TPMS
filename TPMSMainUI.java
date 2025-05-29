import java.awt.*;
import java.awt.event.*;
import java.util.HashMap;
import java.util.Map;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class TPMSMainUI extends JFrame {
    private CardLayout cardLayout;
    private JPanel mainPanel;

    private JTable jobTable, recruiterJobTable, interviewTable;
    private DefaultTableModel jobModel, recruiterModel, interviewModel;

    private JTextArea jobDetailsArea;
    private JTextField titleField, companyField, locationField, deadlineField;
    private JTextArea descriptionArea;

    private String userRole; // "admin", "student", or "recruiter"

    private Map<String, String> jobDescriptions = new HashMap<>();
    private int jobIdCounter = 202; // start after sample job 201

    public TPMSMainUI(String role) {
        this.userRole = role;
        setTitle("Training & Placement Management System");
        setSize(1000, 650);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        String[] studentColumns = {"Job ID", "Title", "Company", "Location", "Deadline"};
        jobModel = new DefaultTableModel(studentColumns, 0);

        if (userRole.equals("admin") || userRole.equals("student")) {
            mainPanel.add(createStudentPanel(), "studentView");
        }
        if (userRole.equals("admin") || userRole.equals("recruiter")) {
            mainPanel.add(createRecruiterPanel(), "recruiterView");
        }
        if (userRole.equals("admin")) {
            mainPanel.add(createInterviewSchedulePanel(), "interviewView");
        }

        JPanel topPanel = new JPanel();
        if (userRole.equals("admin")) {
            JButton viewStudentBtn = new JButton("Student View");
            JButton viewRecruiterBtn = new JButton("Recruiter View");
            JButton viewInterviewBtn = new JButton("Interviews");

            viewStudentBtn.addActionListener(e -> cardLayout.show(mainPanel, "studentView"));
            viewRecruiterBtn.addActionListener(e -> cardLayout.show(mainPanel, "recruiterView"));
            viewInterviewBtn.addActionListener(e -> cardLayout.show(mainPanel, "interviewView"));

            topPanel.add(viewStudentBtn);
            topPanel.add(viewRecruiterBtn);
            topPanel.add(viewInterviewBtn);
        }

        add(topPanel, BorderLayout.NORTH);
        add(mainPanel, BorderLayout.CENTER);
        cardLayout.first(mainPanel);
    }

    private JPanel createStudentPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        jobTable = new JTable(jobModel);
        jobDetailsArea = new JTextArea(5, 40);
        jobDetailsArea.setEditable(false);

        JButton applyButton = new JButton("Apply");
        JButton withdrawButton = new JButton("Withdraw");

        applyButton.addActionListener(e -> showMessage("Applied for selected job."));
        withdrawButton.addActionListener(e -> showMessage("Withdrawn from selected job."));

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(applyButton);
        buttonPanel.add(withdrawButton);

        JScrollPane scrollPane = new JScrollPane(jobTable);
        JScrollPane detailScroll = new JScrollPane(jobDetailsArea);

        jobTable.addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                int row = jobTable.getSelectedRow();
                if (row >= 0) {
                    String jobId = (String) jobModel.getValueAt(row, 0);
                    String desc = jobDescriptions.getOrDefault(jobId, "No description available.");
                    jobDetailsArea.setText(desc);
                }
            }
        });

        panel.add(scrollPane, BorderLayout.NORTH);
        panel.add(detailScroll, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        return panel;
    }

    private JPanel createRecruiterPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        // Form fields panel
        JPanel formPanel = new JPanel(new GridLayout(5, 2));
        titleField = new JTextField();
        companyField = new JTextField();
        locationField = new JTextField();
        deadlineField = new JTextField();
        descriptionArea = new JTextArea(3, 20);

        formPanel.add(new JLabel("Title:"));
        formPanel.add(titleField);
        formPanel.add(new JLabel("Company:"));
        formPanel.add(companyField);
        formPanel.add(new JLabel("Location:"));
        formPanel.add(locationField);
        formPanel.add(new JLabel("Deadline:"));
        formPanel.add(deadlineField);
        formPanel.add(new JLabel("Description:"));
        formPanel.add(new JScrollPane(descriptionArea));

        // Button panel for Post Job
        JPanel buttonPanel = new JPanel();
        JButton postButton = new JButton("Post Job");
        postButton.addActionListener(e -> postRecruiterJob());
        buttonPanel.add(postButton);

        // Combine form and button vertically
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(formPanel, BorderLayout.CENTER);
        topPanel.add(buttonPanel, BorderLayout.SOUTH);

        recruiterModel = new DefaultTableModel(new String[]{"ID", "Title", "Company", "Location", "Deadline", "Description"}, 0);
        recruiterJobTable = new JTable(recruiterModel);
        JScrollPane tableScroll = new JScrollPane(recruiterJobTable);

        // Sample Data
        recruiterModel.addRow(new Object[]{"201", "Software Intern", "TechCorp", "Buea", "2025-06-10", "Assist in development."});
        jobDescriptions.put("201", "Assist in development.");

        panel.add(topPanel, BorderLayout.NORTH);
        panel.add(tableScroll, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createInterviewSchedulePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        interviewModel = new DefaultTableModel(new String[]{"Interview ID", "Candidate", "Date", "Time", "Status"}, 0);
        interviewTable = new JTable(interviewModel);
        JScrollPane scroll = new JScrollPane(interviewTable);
        panel.add(new JLabel("Scheduled Interviews", SwingConstants.CENTER), BorderLayout.NORTH);
        panel.add(scroll, BorderLayout.CENTER);

        // Sample data
        interviewModel.addRow(new Object[]{"INT001", "Student A", "2025-06-01", "10:00 AM", "Scheduled"});
        interviewModel.addRow(new Object[]{"INT002", "Student B", "2025-06-02", "2:00 PM", "Pending"});

        return panel;
    }

    private void postRecruiterJob() {
        String title = titleField.getText().trim();
        String company = companyField.getText().trim();
        String location = locationField.getText().trim();
        String deadline = deadlineField.getText().trim();
        String description = descriptionArea.getText().trim();

        if (title.isEmpty() || company.isEmpty() || location.isEmpty() || deadline.isEmpty()) {
            showMessage("Please fill all the fields.");
            return;
        }

        String id = String.valueOf(jobIdCounter++);
        recruiterModel.addRow(new Object[]{id, title, company, location, deadline, description});
        // Removed adding to jobModel here so student list doesn't show recruiter jobs automatically

        jobDescriptions.put(id, description);

        showMessage("Job Posted Successfully!");
        titleField.setText("");
        companyField.setText("");
        locationField.setText("");
        deadlineField.setText("");
        descriptionArea.setText("");
    }

    private void showMessage(String message) {
        JOptionPane.showMessageDialog(this, message);
    }

    public static void main(String[] args) {
        String[] roles = {"admin", "student", "recruiter"};
        String role = (String) JOptionPane.showInputDialog(null, "Select User Role:", "Login", JOptionPane.QUESTION_MESSAGE, null, roles, roles[0]);
        if (role != null) {
            SwingUtilities.invokeLater(() -> new TPMSMainUI(role).setVisible(true));
        }
    }
}