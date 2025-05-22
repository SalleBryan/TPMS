
import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class TrainingModule extends JFrame {

    // Model class
    static class Training {
        private int id;
        private String title;
        private String description;
        private String trainer;

        public Training(int id, String title, String description, String trainer) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.trainer = trainer;
        }

        public int getId() {
            return id; 
        }
        public String getTitle() {
            return title;
        }
        public String getDescription() {
            return description; 
        }
        public String getTrainer() {
            return trainer; 
        }
    }

    // Repository to store and fetch training data
    static class TrainingRepository {
        private static List<Training> trainingList = new ArrayList<>();

        static {
            trainingList.add(new Training(1, "client and web server computing", "developing interface user interface and backend services", "Numfor Precious"));
            trainingList.add(new Training(2, "Software security management", "protecting system by identifying, assessing and mitigating risks", "Salle Bryan"));
            trainingList.add(new Training(3, "online developement platforms", "tools for building,testing and deploying applications online", "Achou Placid"));
            trainingList.add(new Training(4, "GUI using java and .NET", "creating user-friendly applications with visual components in java and .NET", "Keukang Carmen"));
            trainingList.add(new Training(5, "Web content creation with HTML", "designing and structuring web pages using HTML", "Mingo Emmanuel"));
            trainingList.add(new Training(6, "PHP development with MySQL or MsriaDB databases", "building dynamic web applications with PHP and relational databases", "Ngome Fernandez"));
            trainingList.add(new Training(7, "cloud computing", "delivery of computing services over the internet for flexibility", "Tambe Ramson"));
            trainingList.add(new Training(8, "IT security", "protecting informstion systems from cyber threats and vulnerabilities", "Ayuk Amelia"));
        }

        public static List<Training> getAllTrainings() {
            return trainingList;
        }
    }

    // Constructor to build the UI
    public TrainingModule() {
        setTitle("Available Trainings");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        List<Training> trainings = TrainingRepository.getAllTrainings();
        DefaultListModel<String> model = new DefaultListModel<>();

        for (Training t : trainings) {
            model.addElement(t.getTitle() + " by " + t.getTrainer());
        }

        JList<String> trainingList = new JList<>(model);
        JScrollPane scrollPane = new JScrollPane(trainingList);
        add(scrollPane, BorderLayout.CENTER);

        JButton enrollButton = new JButton("Enroll");
        enrollButton.addActionListener(e -> {
            int selectedIndex = trainingList.getSelectedIndex();
            if (selectedIndex != -1) {
                String selected = trainingList.getSelectedValue();
                JOptionPane.showMessageDialog(this, "You have enrolled in: " + selected);
            } else {
                JOptionPane.showMessageDialog(this, "Please select a training to enroll.");
            }
        });

        add(enrollButton, BorderLayout.SOUTH );
        setVisible(true);
    }

    // Entry point
    public static void main(String[] args) {
        SwingUtilities.invokeLater(TrainingModule::new);
    }
}


   

