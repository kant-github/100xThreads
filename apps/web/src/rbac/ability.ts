import { Action, Permission, Subject } from "types/permission";
import { ProjectMemberRole, UserRole } from "types/types";

export class Ability {
    private rules: Permission[] = [];
    private role: UserRole;
    private projectRole: ProjectMemberRole;

    constructor(role: UserRole, projectRole: ProjectMemberRole = ProjectMemberRole.MEMBER) {
        this.role = role;
        this.projectRole = projectRole;
        this.defineAbilities();
    }

    private defineAbilities() {
        switch (this.role) {
            case UserRole.ADMIN:
                this.addAdminRules();
                break;
            case UserRole.EVENT_MANAGER:
                this.addEventManagerRules();
                break;
            case UserRole.MODERATOR:
                this.addModeratorRules();
                break;
            case UserRole.MEMBER:
                this.addMemberRules();
                break;
            case UserRole.GUEST:
                this.addGuestRules();
                break;
            case UserRole.ORGANIZER:
                this.addOrganizerRules();
                break;
            case UserRole.OBSERVER:
                this.addObserverRules();
                break;
            case UserRole.IT_SUPPORT:
                this.addITSupportRules();
                break;
            case UserRole.HR_MANAGER:
                this.addHRManagerRules();
                break;
            case UserRole.FINANCE_MANAGER:
                this.addFinanceManagerRules();
                break;
            default:
                // Default minimal permissions
                this.addGuestRules();
        }

        // Add project-specific permissions if applicable
        if (this.projectRole) {
            this.addProjectRoleRules();
        }
    }

    private addAdminRules() {
        // Admins can do everything
        this.rules.push({ action: Action.MANAGE, subject: Subject.ORGANIZATION });
    }

    private addEventManagerRules() {
        // Base member permissions
        this.addMemberRules();

        // Event-specific permissions
        this.rules.push(
            { action: Action.CREATE, subject: Subject.EVENT },
            { action: Action.UPDATE, subject: Subject.EVENT },
            { action: Action.DELETE, subject: Subject.EVENT },
            { action: Action.MANAGE, subject: Subject.EVENT },
        );
    }

    private addModeratorRules() {
        // Base member permissions
        this.addMemberRules();

        // Moderation permissions
        this.rules.push(
            // Channel management
            { action: Action.CREATE, subject: Subject.CHANNEL },
            { action: Action.UPDATE, subject: Subject.CHANNEL },

            // Content moderation
            { action: Action.DELETE, subject: Subject.MESSAGE }, // Can delete any message
            { action: Action.UPDATE, subject: Subject.ANNOUNCEMENT },
            { action: Action.DELETE, subject: Subject.ANNOUNCEMENT },

            // Poll management
            { action: Action.CREATE, subject: Subject.POLL },
            { action: Action.UPDATE, subject: Subject.POLL },
            { action: Action.DELETE, subject: Subject.POLL }
        );
    }

    private addMemberRules() {
        // Basic communication permissions
        this.rules.push(
            // Channel access
            { action: Action.READ, subject: Subject.CHANNEL },
            { action: Action.READ, subject: Subject.ORGANIZATION },

            // Messaging
            { action: Action.CREATE, subject: Subject.MESSAGE },
            { action: Action.UPDATE, subject: Subject.MESSAGE, conditions: { isAuthor: true } },
            { action: Action.DELETE, subject: Subject.MESSAGE, conditions: { isAuthor: true } },

            // Project access
            { action: Action.READ, subject: Subject.PROJECT },
            { action: Action.READ, subject: Subject.TASK },

            // Project messaging
            { action: Action.CREATE, subject: Subject.PROJECT_CHAT },
            { action: Action.UPDATE, subject: Subject.PROJECT_CHAT, conditions: { isAuthor: true } },
            { action: Action.DELETE, subject: Subject.PROJECT_CHAT, conditions: { isAuthor: true } },

            // Announcements and events
            { action: Action.READ, subject: Subject.ANNOUNCEMENT },
            { action: Action.READ, subject: Subject.EVENT },

            // Polls
            { action: Action.READ, subject: Subject.POLL }
        );
    }

    private addGuestRules() {
        // Very limited permissions
        this.rules.push(
            { action: Action.READ, subject: Subject.CHANNEL, conditions: { isPublic: true } },
            { action: Action.READ, subject: Subject.MESSAGE, conditions: { inPublicChannel: true } },
            { action: Action.READ, subject: Subject.ANNOUNCEMENT, conditions: { isPublic: true } },
            { action: Action.READ, subject: Subject.EVENT, conditions: { isPublic: true } }
        );
    }

    private addOrganizerRules() {
        // Base member permissions
        this.addMemberRules();

        // Organization management permissions
        this.rules.push(
            { action: Action.CREATE, subject: Subject.CHANNEL },
            { action: Action.UPDATE, subject: Subject.CHANNEL },
            { action: Action.CREATE, subject: Subject.ANNOUNCEMENT },
            { action: Action.CREATE, subject: Subject.EVENT },
            { action: Action.UPDATE, subject: Subject.ANNOUNCEMENT, conditions: { isAuthor: true } },
            { action: Action.CREATE, subject: Subject.PROJECT },
            { action: Action.UPDATE, subject: Subject.PROJECT, conditions: { isCreator: true } },
            { action: Action.MANAGE, subject: Subject.USER_SETTINGS }
        );
    }

    private addObserverRules() {
        // Read-only permissions
        this.rules.push(
            { action: Action.READ, subject: Subject.CHANNEL },
            { action: Action.READ, subject: Subject.MESSAGE },
            { action: Action.READ, subject: Subject.ANNOUNCEMENT },
            { action: Action.READ, subject: Subject.EVENT },
            { action: Action.READ, subject: Subject.PROJECT },
            { action: Action.READ, subject: Subject.TASK },
            { action: Action.READ, subject: Subject.PROJECT_CHAT },
            { action: Action.READ, subject: Subject.POLL }
        );
    }

    private addITSupportRules() {
        // Base member permissions plus technical support capabilities
        this.addMemberRules();

        this.rules.push(
            // Channel management for technical support
            { action: Action.CREATE, subject: Subject.CHANNEL, conditions: { type: 'HELP_DESK' } },
            { action: Action.UPDATE, subject: Subject.CHANNEL, conditions: { type: 'HELP_DESK' } },
            { action: Action.READ, subject: Subject.ORGANIZATION }
        );
    }

    private addHRManagerRules() {
        // Base member permissions plus HR-specific permissions
        this.addMemberRules();

        this.rules.push(
            // Manage announcements for organization-wide communication
            { action: Action.CREATE, subject: Subject.ANNOUNCEMENT },
            { action: Action.UPDATE, subject: Subject.ANNOUNCEMENT },
            { action: Action.DELETE, subject: Subject.ANNOUNCEMENT },

            // Manage events for organization activities
            { action: Action.CREATE, subject: Subject.EVENT },
            { action: Action.UPDATE, subject: Subject.EVENT },
            { action: Action.DELETE, subject: Subject.EVENT },

            { action: Action.CREATE, subject: Subject.TAGS },
            { action: Action.UPDATE, subject: Subject.TAGS },
        );
    }

    private addFinanceManagerRules() {
        // Base member permissions plus finance-specific access
        this.addMemberRules();

        // Specific finance permissions would be added here
        // These might relate to specific organization resources or financial data
    }

    private addProjectRoleRules() {
        // Add project-specific permissions based on project role
        if (this.projectRole === ProjectMemberRole.ADMIN) {
            this.rules.push(
                { action: Action.MANAGE, subject: Subject.PROJECT },
                { action: Action.MANAGE, subject: Subject.TASK },
                { action: Action.MANAGE, subject: Subject.PROJECT_CHAT }
            );
        } else if (this.projectRole === ProjectMemberRole.MEMBER) {
            this.rules.push(
                { action: Action.READ, subject: Subject.PROJECT },
                { action: Action.CREATE, subject: Subject.TASK },
                { action: Action.UPDATE, subject: Subject.TASK, conditions: { isAssignee: true } },
                { action: Action.READ, subject: Subject.TASK },
                { action: Action.CREATE, subject: Subject.PROJECT_CHAT },
                { action: Action.UPDATE, subject: Subject.PROJECT_CHAT, conditions: { isAuthor: true } },
                { action: Action.DELETE, subject: Subject.PROJECT_CHAT, conditions: { isAuthor: true } }
            );
        }
    }

    public can(action: Action, subject: Subject, context: Record<string, any> = {}): boolean {
        // Special case: admins can do everything
        if (this.rules.some(rule =>
            rule.action === Action.MANAGE &&
            rule.subject === Subject.ORGANIZATION
        )) {
            return true;
        }

        return this.rules.some(rule => {
            const actionMatches = rule.action === action || rule.action === Action.MANAGE;
            const subjectMatches = rule.subject === subject;

            if (!actionMatches || !subjectMatches) return false;

            if (rule.conditions) {
                return Object.entries(rule.conditions).every(([key, value]) =>
                    context[key] === value
                );
            }

            return true;
        });
    }

    public cannot(action: Action, subject: Subject, context: Record<string, any> = {}): boolean {
        return !this.can(action, subject, context);
    }
}