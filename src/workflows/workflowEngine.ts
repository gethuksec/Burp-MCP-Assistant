import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    promptId?: string; // Reference to a prompt in the library
    promptTemplate?: string; // Or a direct template
    action: 'copy' | 'insert' | 'execute_mcp';
    nextStepIds?: string[]; // Branching logic
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    initialStepId: string;
    tags: string[];
}

export class WorkflowEngine {
    private workflows: Workflow[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.initializeWorkflows();
    }

    private initializeWorkflows(): void {
        try {
            // Load workflows from resources/workflows
            let workflowsDir = path.join(this.context.extensionPath, 'resources', 'workflows');

            // Fallback for dev
            if (!fs.existsSync(workflowsDir)) {
                workflowsDir = path.join(this.context.extensionPath, 'src', 'workflows', 'data');
            }

            if (fs.existsSync(workflowsDir)) {
                const files = fs.readdirSync(workflowsDir);
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const filePath = path.join(workflowsDir, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        try {
                            const workflow = JSON.parse(content) as Workflow;
                            this.workflows.push(workflow);
                        } catch (e) {
                            console.error(`Error parsing workflow ${file}:`, e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing workflows:', error);
        }
    }

    public getWorkflows(): Workflow[] {
        return this.workflows;
    }

    public getWorkflowById(id: string): Workflow | undefined {
        return this.workflows.find(w => w.id === id);
    }

    public async executeWorkflow(workflowId: string): Promise<void> {
        const workflow = this.getWorkflowById(workflowId);
        if (!workflow) {
            vscode.window.showErrorMessage(`Workflow ${workflowId} not found`);
            return;
        }

        // Simple linear execution for MVP - start with initial step
        let currentStepId: string | undefined = workflow.initialStepId;

        while (currentStepId) {
            const step = workflow.steps.find(s => s.id === currentStepId);
            if (!step) {break;}

            // Prompt user to execute step
            const selection = await vscode.window.showInformationMessage(
                `Hit 'Next' to proceed with step: ${step.name}`,
                'Next', 'Cancel'
            );

            if (selection !== 'Next') {break;}

            // Execute action
            if (step.action === 'copy' && step.promptTemplate) {
                await vscode.env.clipboard.writeText(step.promptTemplate);
                vscode.window.showInformationMessage(`Copied prompt for step: ${step.name}`);
            }

            // Move to next (naive single path for now)
            currentStepId = step.nextStepIds && step.nextStepIds.length > 0 ? step.nextStepIds[0] : undefined;
        }

        vscode.window.showInformationMessage(`Workflow "${workflow.name}" completed!`);
    }
}
