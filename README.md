# Quantifying The Complex Spatiotemporal Chaos of Cardiac Fibrillation in Ionic Models

Complete simulation and analysis code to reproduce all figures in the paper, including spatiotemporal Lyapunov exponent calculations for 3V-SIM and OVVR cardiac models.

## 📋 Table of Contents

- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Analysis Scripts](#-analysis-scripts)
- [Calculation Scripts](#-calculation-scripts)
- [Simulation WebGL Applications](#-simulation-webgl-applications)
- [Figures](#-figures)
- [Usage Instructions](#-usage-instructions)

## 🔧 Environment Setup

Before running any scripts, set up the Python environment:

```bash
# Create and activate conda environment
conda create -n cardiac_fibrillation python=3.9.17
conda activate cardiac_fibrillation

# Install required packages
pip install -r requirements.txt
```

## 📁 Project Structure

```
├── analysis_ipynb_scripts/          # Analysis notebooks and calculated data
├── calculation_ipynb_scripts/       # Scripts to calculate simulation data
├── figs/                           # Original figures from the paper
├── simulations_webGL/              # WebGL simulation applications
├── requirements.txt                # Python dependencies
└── paper.pdf                      # Research paper
```

## 📊 Analysis Scripts

The `analysis_ipynb_scripts/` folder contains all analysis notebooks and pre-calculated data for reproducing the paper's figures:

### Figure Reproductions

| Notebook               | Purpose                           | Paper Reference                   |
| ---------------------- | --------------------------------- | --------------------------------- |
| `single_spiral.ipynb`  | Single spiral wave analysis       | Figures 4, 5, 6                   |
| `tau_d_plot.ipynb`     | Tau-d parameter analysis          | Figure 7                          |
| `tau_r_plot.ipynb`     | Tau-r parameter analysis          | Figure 8                          |
| `tau_0_plot.ipynb`     | Tau-0 parameter analysis          | Figure 9                          |
| `tau_si_plot.ipynb`    | Tau-si parameter analysis         | Figure 10                         |
| `identify_index.ipynb` | Index identification and analysis | Figure 11, Table IV, Appendix CII |
| `ovvr_plot.ipynb`      | OVVR model analysis               | Figure 12                         |
| `experiment.ipynb`     | Experimental results              | Figures 13, 14                    |

### Data Files

The analysis folder also contains pre-calculated data files (`.pkl` and `.csv`) that are used by the analysis notebooks. These files contain the results of Lyapunov exponent calculations and other computational analyses.

## ⚙️ Calculation Scripts

The `calculation_ipynb_scripts/` folder contains scripts for processing simulation data:

- `ovvr_*.ipynb` - OVVR model calculations
- `tau_*_*.ipynb` - Various tau parameter calculations
- These scripts process raw simulation data to generate the analysis-ready datasets

## 🎮 Simulation WebGL Applications

The `simulations_webGL/` folder contains interactive WebGL applications for cardiac fibrillation simulations. To run these simulations, open the corresponding `index.html` files in a web browser:

### Available Simulations

| Simulation Type        | URL                                                                                                                                                                                                                                                                                                                                                                              | Description                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Meander Simulation** | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20meander/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20meander/index.html)                                             | Spiral wave meandering dynamics      |
| **Tau-0 Simulation**   | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_0%20-%20multiple%20times/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_0%20-%20multiple%20times/index.html)   | Multiple tau-0 parameter variations  |
| **Tau-d Simulation**   | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_d%20-%20multiple%20times/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_d%20-%20multiple%20times/index.html)   | Multiple tau-d parameter variations  |
| **Tau-r Simulation**   | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_r%20-%20multiple%20times/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_r%20-%20multiple%20times/index.html)   | Multiple tau-r parameter variations  |
| **Tau-si Simulation**  | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_si%20-%20multiple%20times/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/2D-3V-Model%20-%20tau_si%20-%20multiple%20times/index.html) | Multiple tau-si parameter variations |
| **OVVR Simulation**    | [http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/OVVR-record/index.html](http://xiaodongan.cn/Quantifying-The-Complex-Spatiotemporal-Chaos-of-Cardiac-Fibrillation-in-Ionic-Models/simulations_webGL/OVVR-record/index.html)                                                                         | OVVR cardiac model simulations       |

### Running Simulations

**⚠️ Important Requirements:**

- **Browser**: Use Chrome version 138.0.7204.184 or later
- **Data Download**: Simulation data will be automatically downloaded to your computer
- **Duration**: Each simulation can take up to one day to complete

## 📈 Figures

The `figs/` folder contains all original figures from the research paper, organized for easy reference and comparison with reproduced results.

## 🚀 Usage Instructions

### Quick Start

1. **Set up the environment:**

   ```bash
   conda create -n cardiac_fibrillation python=3.9.17
   conda activate cardiac_fibrillation
   pip install -r requirements.txt
   ```

2. **Run analysis notebooks:**

   - Open Jupyter Lab or Jupyter Notebook
   - Navigate to `analysis_ipynb_scripts/`
   - Run the desired analysis notebook to reproduce specific figures

3. **Explore simulations:**

   - Open any simulation's `index.html` file in a web browser
   - Interact with the WebGL applications to explore cardiac dynamics

### For Advanced Users

If you want to run your own simulations and recalculate the data:

1. **Run the WebGL simulations** to generate new simulation data
2. **Use calculation scripts** in `calculation_ipynb_scripts/` to process the simulation outputs
3. **Run analysis notebooks** with your newly calculated data

## 📚 Citation

If you use this code in your research, please cite the original paper:

```
[Paper citation information to be added]
```

## 🤝 Contributing

This repository contains the complete computational framework for analyzing cardiac fibrillation dynamics. For questions or contributions, please refer to the original research paper or contact the authors.

## 📄 License

This project is licensed under the terms specified in the LICENSE file.
