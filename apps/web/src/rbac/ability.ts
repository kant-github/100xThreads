import { Action, Permission, Subject } from "types/permission";
import { UserRole } from "types/types";

export class Ability {
    private rules: Permission[] = [];

    constructor(private role: UserRole) {
        this.defineAbilities();
    }

    private defineAbilities() {
        switch (this.role) {
            case UserRole.ADMIN:
                console.log("yes admin");
                this.rules.push({ action: Action.MANAGE, subject: Subject.ORGANIZATION })
                break;
            case UserRole.MEMBER:
                this.addMemberRules();
                break;
            // case UserRole.GUEST:
            //     this.rules.push({action: Action.READ})
        }
    }

    private addMemberRules() {
        this.rules.push(
            { action: Action.CREATE, subject: Subject.MESSAGE },
            { action: Action.UPDATE, subject: Subject.MESSAGE, conditions: { isAuthor: true } },
            { action: Action.READ, subject: Subject.CHANNEL }
        );
    }

    public can(action: Action, subject: Subject, context: Record<string, any> = {}): boolean {
        
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